<?php
defined("IN_IA") or exit("Access Denied");

function redPacket_cron()
{
    global $_W;
    pdo_query("update " . tablename("hello_banbanjia_activity_redpacket_record") . " set status = 3 where uniacid = :uniacid and status = 1 and endtime < :time", array(":uniacid" => $_W["uniacid"], ":time" => TIMESTAMP));
    return true;
}
function redPacket_grant($params, $wxtpl_notice = true)
{
    global $_W;
    if (empty($params["title"])) {
        return error(-1, "红包标题不能为空");
    }
    if (empty($params["channel"])) {
        return error(-1, "红包发放渠道不能为空");
    }
    if (empty($params["type"])) {
        return error(-1, "红包类型有误");
    }
    $params["discount"] = floatval($params["discount"]);
    if (empty($params["discount"])) {
        return error(-1, "红包金额有误");
    }
    $params["days_limit"] = intval($params["days_limit"]);
    if (empty($params["days_limit"])) {
        return error(-1, "红包有效期限有误");
    }
    $params["uid"] = intval($params["uid"]);
    if ($params["type"] == "gift") {
        if (empty($params["uid"]) && empty($params["openid"])) {
            return error(-1, "用户信息有误");
        }
    } else {
        if (empty($params["uid"])) {
            return error(-1, "用户uid有误");
        }
    }
    $insert = array(
        "uniacid" => $_W["uniacid"],
        "title" => $params["title"],
        "activity_id" => $params["activity_id"],
        "uid" => $params["uid"],
        "openid" => $params["openid"],
        "channel" => $params["channel"],
        "type" => $params["type"],
        "code" => random(8, true),
        "discount" => $params["discount"],
        "condition" => $params["condition"],
        "starttime" => TIMESTAMP,
        "endtime" => TIMESTAMP + $params["days_limit"] * 86400,
        "category_limit" => $params["category_limit"],
        "times_limit" => $params["times_limit"],
        "status" => 1,
        "granttime" => TIMESTAMP,
        "grantday" => date("Ymd")
    );
    if (0 < $params["sid"]) {
        $insert["sid"] = $params["sid"];
    }
    if (isset($params["status"]) && 0 < $params["order_id"]) {
        $insert["status"] = $params["status"];
        $insert["order_id"] = $params["order_id"];
        $insert["usetime"] = TIMESTAMP;
    }
    if (!empty($params["scene"])) {
        $insert["scene"] = $params["scene"];
    } else {
        $insert["scene"] = "carry";
    }
    if (!empty($params["super_share_id"])) {
        $insert["super_share_id"] = $params["super_share_id"];
    }
    if (0 < $params["grant_days_effect"]) {
        $insert["starttime"] += $params["grant_days_effect"] * 86400;
        $insert["endtime"] += $params["grant_days_effect"] * 86400;
    }
    if (isset($params["is_show"])) {
        $insert["is_show"] = $params["is_show"];
    }
    if ($insert["scene"] == "carry" && isset($params["order_type_limit"])) {
        $insert["order_type_limit"] = $params["order_type_limit"];
    }
    $discount_bear = array("plateform_charge" => $params["discount"], "agent_charge" => 0, "store_charge" => 0);
    if (!empty($params["discount_bear"]) && isset($params["discount_bear"]["plateform_charge"]) && isset($params["discount_bear"]["agent_charge"]) && isset($params["discount_bear"]["store_charge"])) {
        $discount_bear = array_merge($discount_bear, $params["discount_bear"]);
    }
    $insert["data"] = array("discount_bear" => $discount_bear);
    $insert["data"] = iserializer($insert["data"]);
    pdo_insert("hello_banbanjia_activity_redpacket_record", $insert);
    $redpacket_id = pdo_insertid();
    $uid = $params["uid"];
    if (!empty($wxtpl_notice)) {
        mload()->model("member");
        $openid = member_uid2openid($uid);
        if (empty($openid)) {
            return true;
        }
        $config = $_W["we7_wmall"]["config"];
        $params = array("first" => "您在" . $config["mall"]["title"] . "的账户有新的红包", "keyword1" => date("Y-m-d H:i", TIMESTAMP), "keyword2" => "红包到账", "keyword3" => (string) $params["discount"] . "元", "remark" => implode("\n", array("使用条件：满" . $params["condition"] . "元可用", "截至日期：" . date("Y-m-d H:i", $insert["endtime"]))));
        $send = sys_wechat_tpl_format($params);
        $acc = WeAccount::create($_W["acid"]);
        $url = ivurl("pages/member/redPacket/index", array(), true);
        $status = $acc->sendTplNotice($openid, $_W["we7_wmall"]["config"]["notice"]["wechat"]["account_change_tpl"], $send, $url);
        if (is_error($status)) {
            slog("wxtplNotice", "平台红包微信通知顾客", $send, $status["message"]);
        }
    }
    return $redpacket_id;
}

function redPacket_available($price, $filter = array())
{
    global $_W;
    if (empty($filter)) {
        $filter["scene"] = "carry";
    }
    $scene = $filter['scene'];
    $condition = " where uniacid = :uniacid and uid = :uid and status = 1 and scene = :scene and `condition` <= :price";
    $params = array(":uniacid" => $_W["uniacid"], ":price" => floatval($price), ":uid" => $_W["member"]["uid"], ":scene" => trim($scene));
    if (!$_W["member"]["is_mall_newmember"]) {
        $condition .= " and type != :type";
        $params[":type"] = "mallNewMember";
    }
    $redPackets = pdo_fetchall("select * from " . tablename("hello_banbanjia_activity_redpacket_record") . $condition, $params);
    if (!empty($redPackets)) {
        foreach ($redPackets as $key => &$redPacket) {
            $check = redpacket_available_check($redPacket, $price, $filter);
            if (is_error($check)) {
                unset($redPackets[$key]);
            }
            $redPacket["day_cn"] = "限" . date("Y-m-d", $redPacket["starttime"]) . "~" . date("Y-m-d", $redPacket["endtime"]) . "使用";
            // $redPacket["time_cn"] = totime($redPacket["times_limit"]);
            if ($redPacket["scene"] == "carry" && 0 < $redPacket["order_type_limit"]) {
                $order_types = order_types();
                $redPacket["order_type_cn"] = "仅限" . $order_types[$redPacket["order_type_limit"]]["text"] . "单使用";
            }
        }
        $redPackets = array_values($redPackets);
    }
    return $redPackets;
}
function redpacket_available_check($redpacketOrId, $price = 0, $filter = array())
{
    global $_W;
    $redpacket = $redpacketOrId;
    if (!is_array($redpacketOrId)) {
        $redpacketOrId = intval($redpacketOrId);
        $redpacket = pdo_get("hello_banbanjia_activity_redpacket_record", array("uniacid" => $_W["uniacid"], "uid" => $_W["member"]["uid"], "status" => 1, "id" => $redpacketOrId));
    }
    if (empty($redpacket)) {
        return error(-1, "红包记录不存在");
    }
    if (TIMESTAMP < $redpacket["starttime"] || $redpacket["endtime"] < TIMESTAMP) {
        return error(-1, "红包使用期限无效");
    }
    if ($price < $redpacket["condition"]) {
        return error(-1, "未达到红包使用金额");
    }
    if (!empty($filter["sid"]) && !empty($redpacket["sid"]) && $redpacket["sid"] != $filter["sid"]) {
        return error(-1, "限指定门店使用");
    }
    $scene = isset($filter["scene"]) ? $filter["scene"] : "carry";
    if ($redpacket["scene"] != $scene) {
        return error(-1, "红包使用场景无效");
    }
    $redpacket["data"] = iunserializer($redpacket["data"]);
    if (empty($redpacket["data"]["discount_bear"])) {
        $redpacket["data"]["discount_bear"] = array("plateform_charge" => $redpacket["discount"], "agent_charge" => 0, "store_charge" => 0);
    }
    return $redpacket;
}
