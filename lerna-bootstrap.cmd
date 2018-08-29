@echo off

title bootstrapping

echo Dont forget to run this as
echo "              _           _       "
echo "     /\      | |         (_)      "
echo "    /  \   __| |_ __ ___  _ _ __  "
echo "   / /\ \ / _` | '_ ` _ \| | '_ \ "
echo "  / ____ \ (_| | | | | | | | | | |"
echo " /_/    \_\__,_|_| |_| |_|_|_| |_|"

echo Enabling symlinks in windows...

fsutil behavior set SymlinkEvaluation L2L:1 R2R:1 L2R:1 R2L:1

lerna bootstrap

pause
