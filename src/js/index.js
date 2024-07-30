const loadedDataBtn = document.querySelector("#loaded");
const searchBox = document.querySelector(".transactions__search");
const transactionList = document.querySelector(".transactions__list");
const tableContent = document.querySelector(".table");
const tableBody = document.querySelector(".table__body");
const searchInput = document.querySelector("#search");
const price = document.querySelector(".price");
const priceIcon = document.querySelector(".price__sort-icon");
const date = document.querySelector(".date");
const dateIcon = document.querySelector(".date__sort-icon");

// ------------------- API Transactions -------------------

class API {
  static getData() {
    return axios.create({
      baseURL: "http://localhost:3000",
    });
  }
}

// ------------------- display Transactions --------------------

let sortPrice = "asc";
let sortDate = "asc";

class UI {
  static displayTransactions() {
    const data = API.getData();
    data
      .get("/transactions")
      .then((res) => this.createDataTable(res.data))
      .catch((err) => console.log(err));
  }

  static createDataTable(data) {
    tableBody.innerHTML = "";
    let result = "";
    data.forEach((item) => {
      result += `
      <div class="body-tr">
      <p>${item.id}</p>
      <p class="${item.isDeposit ? "deposit" : "withdraw"}">${item.type}</p>
      <p>${item.price.toLocaleString()}</p>
      <p>${item.refId}</p>
      <p>${new Date(item.date).toLocaleString("fa", {
        dateStyle: "short",
        timeStyle: "short",
      })}</p>
      </div>
      `;
      tableBody.innerHTML = result;
    });
    tableContent.appendChild(tableBody);
  }

  static searchByRefId() {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value;
      API.getData()
        .get(`/transactions?refId_like=${query}&_sort=price&_order=desc`)
        .then((res) => this.createDataTable(res.data))
        .catch((err) => console.log(err));
    });
  }

  static sortByPrice() {
    switch (sortPrice) {
      case "asc": {
        sortPrice = "desc";
        API.getData()
          .get(`/transactions?_sort=price&_order=asc`)
          .then((res) => this.createDataTable(res.data))
          .catch((err) => console.log(err));
        break;
      }
      case "desc": {
        sortPrice = "asc";
        API.getData()
          .get(`/transactions?_sort=price&_order=desc`)
          .then((res) => this.createDataTable(res.data))
          .catch((err) => console.log(err));
        break;
      }
    }
    priceIcon.classList.toggle("chevron-up");
  }

  static sortByDate() {
    switch (sortDate) {
      case "asc": {
        sortDate = "desc";
        API.getData()
          .get(`/transactions?_sort=date&_order=asc`)
          .then((res) => this.createDataTable(res.data))
          .catch((err) => console.log(err));
        break;
      }
      case "desc": {
        sortDate = "asc";
        API.getData()
          .get(`/transactions?_sort=date&_order=desc`)
          .then((res) => this.createDataTable(res.data))
          .catch((err) => console.log(err));
        break;
      }
    }
    dateIcon.classList.toggle("chevron-up");
  }

  static showDataTable() {
    searchBox.classList.remove("hidden");
    transactionList.classList.remove("hidden");
  }
}

// ------------------- BtnLoaded --------------------

loadedDataBtn.addEventListener("click", () => {
  UI.showDataTable();
  UI.displayTransactions();
  loadedDataBtn.classList.add("hidden");
});

// ------------------- SortByPrice --------------------

price.addEventListener("click", (e) => {
  UI.sortByPrice();
});

// ------------------- SortByDate --------------------

date.addEventListener("click", (e) => {
  UI.sortByDate();
});

// ------------------- DomLoaded --------------------

document.addEventListener("DOMContentLoaded", () => {
  UI.searchByRefId();
});
