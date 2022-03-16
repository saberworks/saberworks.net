import config from "@/config/config.json";

const { baseUrl } = config.saberworksApi;

class SaberworksApiClient {
  async getGames() {
    return await this.get("/api/saberworks/games");
  }

  async getTags() {
    return await this.get("/api/saberworks/tags");
  }

  /**
   * Projects
   */

  async getProjects() {
    return await this.get("/api/saberworks/projects");
  }

  async addProject(payload) {
    return await this.post(`/api/saberworks/projects`, payload);
  }

  async addProjectWithImage(payload, image) {
    const formData = new FormData();

    formData.append("payload", JSON.stringify(payload));
    formData.append("image", image);

    return await this.post(`/api/saberworks/projects.with_image`, formData);
  }

  async updateProjectWithImage(projectId, payload, image) {
    const formData = new FormData();

    formData.append("payload", JSON.stringify(payload));
    formData.append("image", image);

    return await this.post(`/api/saberworks/projects/${projectId}`, formData);
  }

  async updateProject(projectId, payload) {
    return await this.put(`/api/saberworks/projects/${projectId}`, payload);
  }

  async getProject(projectId) {
    return await this.get(`/api/saberworks/projects/${projectId}`);
  }

  async deleteProject(projectId) {
    return await this.delete(`/api/saberworks/projects/${projectId}`);
  }

  /**
   * Posts
   */

  async getPosts(projectId) {
    return this.get(`/api/saberworks/projects/${projectId}/posts`);
  }

  async getPost(projectId, postId) {
    return this.get(`/api/saberworks/projects/${projectId}/posts/${postId}`);
  }

  async addPost(projectId, payload) {
    return await this.post(
      `/api/saberworks/projects/${projectId}/posts`,
      payload
    );
  }

  async addPostWithImage(projectId, payload, image) {
    const formData = new FormData();

    formData.append("payload", JSON.stringify(payload));
    formData.append("image", image);

    return await this.post(
      `/api/saberworks/projects/${projectId}/posts.with_image`,
      formData
    );
  }

  async updatePostWithImage(projectId, postId, payload, image) {
    const formData = new FormData();

    formData.append("payload", JSON.stringify(payload));
    formData.append("image", image);

    return await this.post(
      `/api/saberworks/projects/${projectId}/posts/${postId}`,
      formData
    );
  }

  async deletePost(projectId, postId) {
    return await this.delete(
      `/api/saberworks/projects/${projectId}/posts/${postId}`
    );
  }

  /**
   * Screenshots
   */

  async getScreenshots(projectId: number) {
    return this.get(`/api/saberworks/projects/${projectId}/screenshots`);
  }

  async deleteScreenshot(projectId: number, screenshotId: number) {
    return await this.delete(
      `/api/saberworks/projects/${projectId}/screenshots/${screenshotId}`
    );
  }

  /**
   * Files
   */

  async getFiles(projectId: number) {
    return this.get(`/api/saberworks/projects/${projectId}/files`);
  }

  async stageFile(projectId: number) {
    return await this.post(
      `/api/saberworks/projects/${projectId}/files.stage`,
      {}
    );
  }

  async uploadFile(projectId: number, fileId: number, file: Blob) {}

  async addFileWithImage(
    projectId: number,
    payload: {},
    file: string | Blob,
    image: string | Blob
  ) {
    const formData = new FormData();

    formData.append("payload", JSON.stringify(payload));
    formData.append("file", file);
    formData.append("image", image);

    return await this.post(
      `/api/saberworks/projects/${projectId}/files`,
      formData
    );
  }

  async updateFile() {}

  async updateFileWithImage(
    projectId: number,
    fileId: number,
    payload: {},
    image: string | Blob
  ) {
    const formData = new FormData();

    console.dir(payload);

    formData.append("payload", JSON.stringify(payload));
    formData.append("image", image);

    return await this.post(
      `/api/saberworks/projects/${projectId}/files/${fileId}`,
      formData
    );
  }

  async deleteFile(projectId, fileId) {
    return await this.delete(
      `/api/saberworks/projects/${projectId}/files/${fileId}`
    );
  }

  /**
   * Generic methods
   */

  async get(path, options = {}) {
    return this.request("GET", path, options);
  }

  async post(path, body, options = {}) {
    const preparedOptions = this.prepareRequestOptions(body, options);

    return this.request("POST", path, preparedOptions);
  }

  async put(path, body, options = {}) {
    const preparedOptions = this.prepareRequestOptions(body, options);

    return this.request("PUT", path, preparedOptions);
  }

  async delete(path, options = {}) {
    const preparedOptions = this.prepareRequestOptions(null, options);

    return this.request("DELETE", path, preparedOptions);
  }

  async request(method, path, options = {}) {
    const url = `${baseUrl}${path}`;

    const response = await fetch(url, {
      method: method,
      credentials: "include",
      ...options,
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching ${path}: ${response.status} (${response.statusText}) `
      );
    }

    return await response.json();
  }

  /**
   * Utility methods
   */

  prepareRequestOptions(body, options = {}) {
    options["headers"] = {
      "X-CSRFToken": this._csrftoken(),
    };

    if (body instanceof FormData) {
      options["body"] = body;
    } else {
      options["headers"]["Content-Type"] = "application/json";

      if (body) {
        options["body"] = JSON.stringify(body);
      }
    }

    return options;
  }

  _csrftoken() {
    // django requires csrftoken to be in the request headers; yank it out
    // of the cookie and put it in the headers
    // TODO: switch to a non-cookie based auth???
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      .split("=")[1];
  }
}

const saberworksApiClient = new SaberworksApiClient();

export { baseUrl, saberworksApiClient };
