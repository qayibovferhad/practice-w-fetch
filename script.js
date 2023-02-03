const tbody = document.querySelector("#tbody");
const paginationList = document.querySelector("#pagination-list");
const limitSelect = document.querySelector("#limit-select");
const searchInput = document.querySelector("#search-input");
let limit = 10;
let skip = 0;
let total = 0;
let q = "";
fetchUsers();
paginationList.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.tagName === "A") {
    const action = e.target.id;
    switch (action) {
      case "next":
        skip += limit;

        break;
      case "prev":
        skip -= limit;

        break;
      default:
        const page = Number(action);
        skip = (page - 1) * limit;
        break;
    }
    fetchUsers();
  }
});
searchInput.addEventListener("keyup", function (event) {
  q = event.target.value;
  fetchUsers();
});

limitSelect.addEventListener("change", function (e) {
  limit = Number(e.target.value);
  fetchUsers();
});

function fetchUsers() {
  fetch(`https://dummyjson.com/users/search?skip=${skip}&limit=${limit}&q=${q}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      total = data.total;

      generateTableRows(data.users);
      generatePagination();
    });
}
function generateTableRows(users) {
  let generatedHtml = "";
  for (let user of users) {
    generatedHtml += generateTableRow(user);
  }
  tbody.innerHTML = generatedHtml;
}
function generateTableRow(user) {
  return `
    <tr>
    <th scope="row">${user.id}</th>
    <td>${user.username}</td>
    <td>${user.firstName}</td>
    <td>${user.lastName}</td>
    <td>${user.gender}</td>
    <td>${user.email}</td>
    <td>${user.age}</td>
    <td>${user.birthDate}</td>
    <td>${user.ip}</td>
    <td>${user.macAddress}</td>
</tr>

    `;
}
function generatePagination() {
  let paginationHtml = "";
  const pageCount = Math.ceil(total / limit);
  const currentPage = Math.floor(skip / limit) + 1;
  if (pageCount === 1) {
    paginationList.innerHTML = "";
    return;
  }

  paginationHtml += `<li class="page-item">
    <a id="prev" class="page-link ${skip === 0 ? "disabled" : ""}" href="#">
        Previous
    </a>
    
</li>`;
  for (let page = 1; page <= pageCount; page++) {
    paginationHtml += `<li class="page-item">
    <a id="${page}" class="page-link ${
      page === currentPage ? "active" : ""
    }" href="#">
        ${page}
    </a>
    
</li>`;
  }
  paginationHtml += `<li class="page-item">
<a id="next" class="page-link ${
    skip + limit >= total ? "disabled" : ""
  }" href="#">
    next
</a>

</li>`;
  paginationList.innerHTML = paginationHtml;
}
