# stage 1 - build react app first
FROM node:18.18.1-alpine3.18 as build
ARG VITE_API_ENDPOINT_URL_DOC_AUTH
ARG VITE_API_ENDPOINT_URL_PROMPT_LIBRARY
ARG VITE_API_ENDPOINT_URL_CONTENT_LIBRARY
WORKDIR /app
COPY . .
RUN npm install
ENV VITE_API_ENDPOINT_URL_DOC_AUTH=$VITE_API_ENDPOINT_URL_DOC_AUTH
ENV VITE_API_ENDPOINT_URL_PROMPT_LIBRARY=$VITE_API_ENDPOINT_URL_PROMPT_LIBRARY
ENV VITE_API_ENDPOINT_URL_CONTENT_LIBRARY=$VITE_API_ENDPOINT_URL_CONTENT_LIBRARY
RUN npm run build

# stage 2 - build the final image and copy the react build files
FROM nginx:1.24.0-alpine3.17
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]