@echo off

title bootstrapping

REM echo Dont forget to run this as
REM echo "              _           _       "
REM echo "     /\      | |         (_)      "
REM echo "    /  \   __| |_ __ ___  _ _ __  "
REM echo "   / /\ \ / _` | '_ ` _ \| | '_ \ "
REM echo "  / ____ \ (_| | | | | | | | | | |"
REM echo " /_/    \_\__,_|_| |_| |_|_|_| |_|"

REM echo Enabling symlinks in windows...

REM fsutil behavior set SymlinkEvaluation L2L:1 R2R:1 L2R:1 R2L:1

lerna bootstrap

pause
