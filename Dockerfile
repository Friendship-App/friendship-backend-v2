FROM node:7
RUN mkdir /friendship_v2
ADD . /friendship_v2
WORKDIR /friendship_v2
RUN yarn init
EXPOSE 80
CMD ["yarn", "watch"]