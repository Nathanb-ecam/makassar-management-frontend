### To deploy a new version

1. Check`.env`file:

2. Build locally with:

   ```shell
   npm run build
   ```

3. Create the docker image:

   ```shell
    docker buildx build --build-arg VERSION=0.0.1 -f DockerfileProd --platform linux/amd64 -t dockerhubUsername/dockerhubRepoName:version-tag . --progress plain --push
   ```

4. Use the new docker image on the hosting machine
