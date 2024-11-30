const API_URL = "https://api.github.com/users/";

const form = document.getElementById("form");
const search = document.getElementById("search");
const main = document.getElementById("main");

async function getUser(userName) {
  try {
    const url = API_URL + userName;
    const { data } = await axios(url);

    // Yeni kullanıcı kartını oluşturmadan önce önceki hata mesajını veya kullanıcı verilerini temizleyin
    main.innerHTML = "";

    // Kullanıcı kartını oluştur ve göster
    createUserCard(data);

    // Depoları getir ve göster
    getRepos(userName);
  } catch (err) {
    console.error("Error fetching user:", err);

    // Önceki içeriği temizle ve hata kartını göster
    main.innerHTML = "";
    createErrorCard("User not found.");
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = search.value.trim();
  if (user) {
    getUser(user); // Form gönderildiğinde kullanıcıyı al
    search.value = ""; // Giriş alanını temizle
  }
});

function createUserCard(user) {
  const userName = user.name || user.login;
  const userBio = user.bio ? `<p>${user.bio}</p>` : "";

  const cardHTML = `
    <div class="card" id="user-card">
      <img
        class="user-image"
        src="${user.avatar_url}"
        alt="${user.name}"
      />

      <div class="user-info">
        <div class="user-name">
          <h2>${userName}</h2>
          <small>@${user.login}</small>
        </div>
      </div>

      <p>${userBio}</p>

      <ul>
        <li>
          <i class="fa-solid fa-user-group"></i> ${user.followers}
          <strong>Followers</strong>
        </li>
        <li>${user.following} <strong>Following</strong></li>
        <li>
          <i class="fa-solid fa-bookmark"></i> ${user.public_repos}
          <strong>Repository</strong>
        </li>
      </ul>

      <div class="repos" id="repos"></div>
    </div>
  `;

  // Kullanıcı kartını ana konteynere ekleyin
  main.innerHTML = cardHTML;
}

function createErrorCard(msg) {
  const cardErrorHTML = `
    <div class="card">
      <h2>${msg}</h2>
    </div>
  `;
  main.innerHTML = cardErrorHTML;
}

async function getRepos(userName) {
  try {
    const url = API_URL + userName + "/repos";
    const { data } = await axios(url);

    // Kullanıcının deposu yoksa uygun bir mesaj göster
    if (data.length === 0) {
      createErrorCard("Bu kullanıcının halka açık deposu yok.");
    } else {
      addReposToCard(data);
    }
  } catch (err) {
    console.error("Depolar alınırken hata oluştu:", err);
    createErrorCard("Depolar getirilirken hata oluştu.");
  }
}

function addReposToCard(repos) {
  const reposEl = document.getElementById("repos");

  // Clear existing repo links, if any
  reposEl.innerHTML = "";

  repos.slice(0, 3).forEach((repo) => {
    const reposLink = document.createElement("a");
    reposLink.href = repo.html_url;
    reposLink.target = "_blank"; // Yeni sekmede aç
    reposLink.innerHTML = `<i class="fa-solid fa-book-bookmark"></i> ${repo.name}`;
    reposEl.appendChild(reposLink);
  });
}
