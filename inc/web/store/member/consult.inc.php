<?php
defined("IN_IA") or exit("Access Denied");
global $_W;
global $_GPC;
mload()->lmodel("member");
$_W["page"]["title"] = "顾客咨询";