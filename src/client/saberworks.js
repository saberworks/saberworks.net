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

  async addProject(newProject) {
    return await this.post("/api/saberworks/projects", newProject);
  }

  async getProject(projectId) {
    return await this.get(`/api/saberworks/projects/${projectId}`);
  }

  async deleteProject(projectId) {
    return await this.delete(`/api/saberworks/projects/${projectId}`);
  }

  async updateProject(project) {}

  async get(path, options = {}) {
    return this.request("GET", path, options);
  }

  async post(path, body, options = {}) {
    options["cache"] = "no-cache";
    options["headers"] = {
      "Content-Type": "application/json",
      "X-CSRFToken": this._csrftoken(),
    };
    options["body"] = JSON.stringify(body);

    return this.request("POST", path, options);
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
    // TODO: pull this into a util or switch to a non-cookie based auth
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      .split("=")[1];
  }
}

const saberworksApiClient = new SaberworksApiClient();

export { baseUrl, saberworksApiClient };
