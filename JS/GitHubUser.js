export class GitHubConnectionUsers {
  static search(userName) {
    const url = `https://api.github.com/users/${userName}`;

    return fetch(url)
      .then((data) => data.json())
      .then(({ login, name, public_repos, followers }) => ({
        login,
        name,
        public_repos,
        followers,
      }));
  }
}
