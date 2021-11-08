FROM node:16-buster

WORKDIR /opt/app

RUN apt-get update && \
    apt-get install -y \
		postgresql-client

# Install Monarch
RUN curl -o /usr/local/bin/monarch https://cdn.mantl.team/assets/binaries/monarch/linux-8790d0f \
	&& chmod +x /usr/local/bin/monarch

# update npm
RUN npm i -g npm

# Copy in source files
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
RUN npm i

COPY Makefile ./Makefile
COPY .monarch.default.json ./.monarch.default.json
COPY ./src ./src

# clean up
RUN rm -rf /var/lib/apt/lists/*
