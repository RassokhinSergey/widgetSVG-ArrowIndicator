<?php
$volt = 210;

$format= "_jqjsp({'v': '%s'})";

if ($_GET["id"] === "voltL1") {
    $volt = 210;
}
if ($_GET["id"] === "voltL2") {
    $volt = 220;
}
if ($_GET["id"] === "voltL3") {
    $volt = 245;
}

echo sprintf($format, $volt);
?> 
