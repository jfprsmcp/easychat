FROM chatwoot:development

# Instalar Node.js y Yarn en Alpine Linux
RUN apk add --no-cache curl bash nodejs npm && \
    curl -o- -L https://yarnpkg.com/install.sh | bash && \
    ln -s /root/.yarn/bin/yarn /usr/local/bin/yarn && \
    ln -s /root/.yarn/bin/yarnpkg /usr/local/bin/yarnpkg

# Dar permisos de ejecución al script de Webpack
RUN chmod +x docker/entrypoints/webpack.sh

EXPOSE 3035

CMD ["bin/webpack-dev-server"]
