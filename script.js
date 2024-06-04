const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameEl = document.getElementById("website-name");
const websiteAddressEl = document.getElementById("website-address");
const bookmarksContainer = document.getElementById("bookmarks-container");

let bookmarks = {};

// show modal, focus on input
function showModal() {
  modal.classList.add("show-modal");
  websiteNameEl.focus();
}

// add event listener for modal
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", (e) =>
  modal.classList.remove("show-modal")
);
window.addEventListener("click", (e) =>
  e.target === modal ? modal.classList.remove("show-modal") : false
);

// validate form
function formValidation(nameValue, webAddressValue) {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);

  if (!nameValue || !webAddressValue) {
    alert("Please enter values in both fields!");
    return false;
  }

  if (!webAddressValue.match(regex)) {
    alert("Please provide a valid web address!");
    return false;
  }
  // valid
  return true;
}

// build bookmarkks DOM
function buildBookmarks() {
  // remove all bookmark elements
  bookmarksContainer.textContent = "";
  // build items
  Object.keys(bookmarks).forEach((id) => {
    const { name, url } = bookmarks[id];
    // Item
    const item = document.createElement("div");
    item.classList.add("item");
    // close icon
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fa-solid", "fa-xmark");
    closeIcon.setAttribute("title", "delete bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${id}')`);

    // fav icon / link container
    const linkInfo = document.createElement("div");
    linkInfo.classList.add("name");

    // fav icon
    const favicon = document.createElement("img");
    favicon.setAttribute(
      "src",
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute("alt", "Favicon");

    // link
    const link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;
    // append to bookmarks container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
}

// fetch bookmarks
function fetchBookmarks() {
  // get bookmarks from local storage IF available
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  } else {
    // create bookmarks array in LS
    const id = `https://youtube.com`;
    bookmarks[id] = [
      {
        name: "Youtube",
        url: "https://youtube.com",
      },
    ];
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
  buildBookmarks();
}

//  Delete bookamrks
function deleteBookmark(id) {
  if (bookmarks[id]) {
    delete bookmarks[id];
  }

  // update bookmarks array in LS - repopulate dom
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
}

// store bookmark data
function storeBookmark(e) {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let webAddressValue = websiteAddressEl.value;
  if (
    !webAddressValue.includes("https://") &&
    !webAddressValue.includes("http://")
  ) {
    webAddressValue = `https://${webAddressValue}`;
  }

  if (!formValidation(nameValue, webAddressValue)) {
    return false;
  }

  const bookmark = {
    name: nameValue,
    url: webAddressValue,
  };
  bookmarks[webAddressValue] = bookmark;

  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteAddressEl.focus();
}

// Event Listener
bookmarkForm.addEventListener("submit", storeBookmark);

// on load fetch bookmarks
fetchBookmarks();
