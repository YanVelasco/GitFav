import { GitHubConnectionUsers } from "./GitHubUser.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
  }

  // Código assincôno
  async add(userName) {
    // Tratando possíveis erros na aplicação
    try {
      const user = await GitHubConnectionUsers.search(userName);
      console.log(user);

      if (user.login === undefined) {
        throw new Error("Usuário não encontrado!");
      } else if (this.entries.some((entry) => entry.login === user.login)) {
        alert("Usuário já está cadastrado");
      } else {
        this.entries = [user, ...this.entries];
        this.update();
        this.save();
      }
    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    );

    this.entries = filteredEntries;
    this.update();
    this.save();
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = document.querySelector("table tbody");

    this.onAdd();
    this.update();
  }

  onAdd() {
    const addButton = this.root.querySelector(".button__add");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");
      
      this.add(value)
    };
  }

  update() {
    this.removeAllTr();

    this.entries.forEach((user) => {
      const row = this.createRow();
      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`;
      row.querySelector(".user p").textContent = user.name;
      row.querySelector(".user a").href = `https://github.com/${user.login}`;
      row.querySelector('.user span').textContent = user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;
      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Tem certeza que deseja apagar o usuário?");

        if (isOk) {
          this.delete(user);
          this.update();
        }
      };

      this.tbody.append(row);
    });
  }

  createRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
                <td class="user">
                <img
                    src="https://github.com/YanVelasco.png"
                    alt="Imagem de usuário"
                />
                <a href="https://github.com/YanVelasco" target="_blank">
                    <p>Yan Velasco</p>
                    <span>YanVelasco</span>
                </a>
                </td>
                <div class="informations-remove">
                <td class="repositories">65</td>
                <td class="followers">57484</td>
                <td>
                    <button class="remove">
                    <h1>Remover?</h1>
                    </button>
                </td>
                </div>
        `;
    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
