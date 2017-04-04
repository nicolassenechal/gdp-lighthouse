FROM markadams/chromium-xvfb-js:7

WORKDIR /var/app/current
COPY ./package.json /var/app/current/package.json
COPY ./run.sh /var/app/current/run.sh
RUN npm i
RUN chmod -R 777 node_modules
RUN chmod -R 777 run.sh
RUN export LIGHTHOUSE_CHROMIUM_PATH="$(pwd)/chrome-linux/chrome"

CMD ./run.sh
