# 연말 이벤트

## 실행방법

mongodb 실행

    # cd /home/yhbyun/local/mongodb-linux-x86_64-2.0.2/bin
    # ./mongod --dbpath ~/local/db

    데몬 형태로 실행 
    # nohup ./mongod --dbpath ~/local/db 1> /dev/null 2>&1 & 

web app 실행

    # node app.js

    데몬 형태로 실행
    # forever -l forever.log -o stdout.log -e stderr.log start app.js


## URL

- 메시지 보기, 올리기 
http://localhost:3000/memo

- 메시지 랜덤하게 표시하기
http://localhost:3000/message.html

- 메시지  추첨
http://localhost:3000/memo/slot


## 서비스 도메인 및 URL 변경시 수정해야 할 소스

public/canvas/apt18.js

- 3 군데의 ajax 소스 URL

## 페이지 타이틀 변경하기

- views/layout.jade
- views/slot_layout.jade
- public/message.html

