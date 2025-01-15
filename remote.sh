#!/bin/zsh
option=$1

if [ -z "$option" ]; then
echo "Please ether private or company" 
exit 1
fi

# 根据参数选择远程地址
if [ $option = "private" ]; then
  remote_url="git@github.com:About-JayX/memes_miniapp.git"
   git config user.name "jay"
  git config user.email "3334354196@qq.com"
elif [ $option = "company" ]; then
  remote_url="git@git_ye:xichuxiaobawang/mego_plan.git"
   git config user.name "xichuxiaobawang"
  git config user.email "125800ye@gmail.com"
else
  echo "Please ether private or company"
  exit 1
fi

git remote remove origin

git remote add origin $remote_url

git pull 

git branch --set-upstream-to=origin/main main

