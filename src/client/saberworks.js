import config from "@/config/config.json";

const { baseUrl } = config.saberworksApi;

class SaberworksApiClient {
  async getGames() {
    return await this.get("/api/saberworks/games");
  }

  async getTags() {
    return await this.get("/api/saberworks/tags");
  }

  async getProjects() {
    return await this.get("/api/saberworks/projects");
  }

  async addProject(formData) {
    const options = {
      cache: "no-cache",
      headers: {
        "X-CSRFToken": this._csrftoken(),
      },
    };

    return await this.post(`/api/saberworks/projects`, formData, options);
  }

  async updateProject(projectId, formData) {
    const options = {
      cache: "no-cache",
      headers: {
        "X-CSRFToken": this._csrftoken(),
      },
    };

    return await this.post(
      `/api/saberworks/projects/${projectId}`,
      formData,
      options
    );
  }

  async getProject(projectId) {
    return await this.get(`/api/saberworks/projects/${projectId}`);
  }

  async deleteProject(projectId) {
    return await this.delete(`/api/saberworks/projects/${projectId}`);
  }

  async getPosts(projectId) {
    return this.get(`/api/saberworks/projects/${projectId}/posts`);
  }

  async addPost(projectId, formData) {
    const options = {
      cache: "no-cache",
      headers: {
        "X-CSRFToken": this._csrftoken(),
      },
    };

    return await this.post(
      `/api/saberworks/projects/${projectId}/posts`,
      formData,
      options
    );
  }

  async deletePost(projectId, postId) {
    return await this.delete(
      `/api/saberworks/projects/${projectId}/posts/${postId}`
    );
  }

  async getScreenshots(projectId) {
    return this.get(`/api/saberworks/projects/${projectId}/screenshots`);
  }

  async deleteScreenshot(projectId, screenshotId) {
    return await this.delete(
      `/api/saberworks/projects/${projectId}/screenshots/${screenshotId}`
    );
  }

  async get(path, options = {}) {
    return this.request("GET", path, options);
  }

  async post(path, body, options = {}) {
    if (Object.keys(options).length == 0) {
      options["cache"] = "no-cache";
      options["headers"] = {
        "Content-Type": "application/json",
        "X-CSRFToken": this._csrftoken(),
      };
      options["body"] = JSON.stringify(body);
    } else {
      options["body"] = body;
    }

    return this.request("POST", path, options);
  }

  async put(path, body, options = {}) {
    if (Object.keys(options).length == 0) {
      options["cache"] = "no-cache";
      options["headers"] = {
        "Content-Type": "application/json",
        "X-CSRFToken": this._csrftoken(),
      };
      options["body"] = JSON.stringify(body);
    } else {
      options["body"] = body;
    }

    return this.request("PUT", path, options);
  }

  async delete(path, options = {}) {
    options["cache"] = "no-cache";
    options["headers"] = {
      "Content-Type": "application/json",
      "X-CSRFToken": this._csrftoken(),
    };

    return this.request("DELETE", path, options);
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
