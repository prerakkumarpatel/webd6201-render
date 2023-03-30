"use strict";
(function () {
    function DisplayHomePage() {
        console.log("home page called");
        $("#AboutUsBtn").on("click", () => LoadLink("about"));
        $("main").append(`<article class="container"><p id="ArticleParagraph" class="mt-3">This is Article paragraph</p> </article>`);
        $("main").append(`<p class="mt-3" id="MainParagraph">This is jquery generated paragraph</p> `);
    }
    function LoadLink(link, data = "") {
        router.ActiveLink = link;
        console.log("load link called for" + router.ActiveLink);
        AuthGuard();
        router.LinkData = data;
        history.pushState({}, "", router.ActiveLink);
        document.title = router.ActiveLink.substring(0, 1).toUpperCase() + router.ActiveLink.substring(1);
        $("ul>li>a").each(function () {
            $(this).removeClass("active");
        });
        $(`li>a:contains(${document.title})`).addClass("active");
        CheckLogin();
        LoadContent();
    }
    function AddNavigationEvents() {
        let NavLinks = $("ul>li>a");
        NavLinks.off("click");
        NavLinks.off("mouseover");
        NavLinks.on("click", function () {
            LoadLink($(this).attr("data"));
        });
        NavLinks.on("mouseover", function () {
            $(this).css("cursor", "pointer");
        });
    }
    function AddLinkEvents(link) {
        let linkQuery = $(`a.link[data=${link}]`);
        linkQuery.off("click");
        linkQuery.off("mouseover");
        linkQuery.off("mouseout");
        linkQuery.css("text-decoration", "underline");
        linkQuery.css("color", "blue");
        linkQuery.on("click", function () {
            LoadLink(`${link}`);
        });
        linkQuery.on("mouseover", function () {
            $(this).css('cursor', 'pointer');
            $(this).css('font-weight', 'bold');
        });
        linkQuery.on("mouseout", function () {
            $(this).css('font-weight', 'normal');
        });
    }
    function LoadHeader() {
        console.log("load headder called");
        $.get("./views/components/header.html", function (html_data) {
            $("header").html(html_data);
            AddNavigationEvents();
            CheckLogin();
        });
    }
    function DisplayProjectPage() {
        console.log("Display project page called");
    }
    function DisplayServicePage() {
        console.log("Display Service page called");
    }
    function DisplayAboutPage() {
        console.log("Display About page called");
    }
    function RegisterFormValidation() {
        ValidateField("#firstName", /^[a-zA-Z]{2,}$/, "Please enter valid first name more than 1 letter");
        ValidateField("#lastName", /^[a-zA-Z]{2,}$/, "Please enter valid  last name more than 1 letter");
        ValidateField("#emailAddress", /^([a-zA-Z0-9._-]{3,20})+(@[a-zA-Z0-9._-]{2,20})+\.[a-zA-Z]{3,20}$/, "Please enter valid email address");
    }
    function ContactFormValidation() {
        ValidateField("#fullName", /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-z][a-z]+))*$/, "Please enter valid first and last name as ( first last )  ");
        ValidateField("#contactNumber", /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/, "Please enter valid contact number as (xxx-xxx-xxxx) ");
        ValidateField("#emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, "Please enter valid email address");
    }
    function DisplayContactPage() {
        console.log("Display Contact page called");
        $("a[data='contact-list']").off("click");
        $("a[data='contact-list']").on("click", function () {
            LoadLink("contact-list");
        });
        $("#contactList").on("click", () => LoadLink("contact-list"));
        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");
        sendButton.addEventListener("click", (e) => {
            e.preventDefault();
            console.log("submit  button is clicked");
            if (subscribeCheckbox.checked) {
                let fullName = document.forms[0].fullName.value;
                let contactNumber = document.forms[0].contactNumber.value;
                let emailAddress = document.forms[0].emailAddress.value;
                AddContact(fullName, contactNumber, emailAddress);
                LoadLink("contact-list");
            }
        });
        ContactFormValidation();
    }
    function AddContact(fullName, contactNumber, emailAddress) {
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()) {
            let key = contact.FullName.substring(0, 1) + Date.now();
            localStorage.setItem(key, contact.serialize());
        }
    }
    function DisplayContactListPage() {
        console.log("Display Contact List page called");
        if (localStorage.length > 0) {
            let contactList = document.getElementById("contactList");
            let data = "";
            let keys = Object.keys(localStorage);
            let index = 1;
            for (const key of keys) {
                let contactData = localStorage.getItem(key);
                let contact = new core.Contact();
                contact.deserialize(contactData);
                data += `
                    <tr>
                        <th scope="row" class="text-center">${index}</th>
                        <td>${contact.FullName}</td>
                        <td>${contact.ContactNumber}</td>
                        <td>${contact.EmailAddress}</td>
                        <td class="text-center">
                            <button value="${key}" class="btn btn-primary btn-sm edit">                          
                                <i class="fas fa-edit fa-sm"> Edit</i>
                            </button>           
                        </td>
                        <td class="text-center">
                            <button value="${key}" class="btn btn-danger btn-sm delete">                          
                                <i class="fas fa-trash-alt fa-sm"> Delete</i>
                            </button>           
                        </td>
                      
                    </tr>`;
                index++;
            }
            contactList.innerHTML = data;
        }
        $("button.delete").on("click", function () {
            if (confirm("Delete contact ,are you sure?")) {
                localStorage.removeItem($(this).val());
            }
            LoadLink("contact-list");
        });
        $("button.edit").on("click", function () {
            LoadLink("edit", $(this).val());
        });
        $("#addButton").on("click", () => {
            LoadLink("edit", "add");
        });
    }
    function ValidateField(input_field_id, regular_expression, error_message) {
        const messageArea = $("#messageArea").hide();
        $(input_field_id).on("blur", function () {
            const inputFieldText = $(this).val();
            if (!regular_expression.test(inputFieldText)) {
                $(this).trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger").text(error_message).show();
            }
            else {
                messageArea.removeAttr("class").hide();
            }
        });
        $("#password").on("blur", function () {
            if ($("#password").val().length < 0) {
                messageArea.removeAttr("class").hide();
            }
            else if ($("#password").val().length < 6) {
                messageArea.addClass("alert alert-danger").text("Password must be at least 6 letters").show();
            }
            else {
                messageArea.removeAttr("class").hide();
            }
        });
        $("#confirmPassword").on("blur", function () {
            if ($("#confirmPassword").val().length < 0) {
                messageArea.removeAttr("class").hide();
            }
            else if ($("#confirmPassword").val().length < 6) {
                messageArea.addClass("alert alert-danger").text("Confirm password must be at least 6 letters").show();
            }
            else if ($("#confirmPassword").val() !== $("#password").val()) {
                messageArea.addClass("alert alert-danger").text("Passwords must match").show();
            }
            else {
                messageArea.removeAttr("class").hide();
            }
        });
    }
    function DisplayEditPage() {
        console.log("Edit Contact Page ");
        ContactFormValidation();
        let page = router.LinkData;
        switch (page) {
            case "add":
                $("main>h1").text("Add Contact");
                $("#editButton").html(`<i class="fas fa-plus-circle fa-sm"> Add</i>`);
                $("#editButton").on("click", (event) => {
                    event.preventDefault();
                    let fullName = document.forms[0].fullName.value;
                    let contactNumber = document.forms[0].contactNumber.value;
                    let emailAddress = document.forms[0].emailAddress.value;
                    AddContact(fullName, contactNumber, emailAddress);
                    LoadLink("contact-list");
                });
                $("#cancelButton").on("click", () => {
                    LoadLink("contact-list");
                });
                break;
            default:
                {
                    $("#editButton").html(`<i class="fas fa-plus-circle fa-sm"> Save</i>`);
                    let contact = new core.Contact();
                    contact.deserialize(localStorage.getItem(page));
                    $("#fullName").val(contact.FullName);
                    $("#contactNumber").val(contact.ContactNumber);
                    $("#emailAddress").val(contact.EmailAddress);
                    $("#editButton").on("click", (event) => {
                        event.preventDefault();
                        contact.FullName = $("#fullName").val();
                        contact.ContactNumber = $("#contactNumber").val();
                        contact.EmailAddress = $("#emailAddress").val();
                        localStorage.setItem(page, contact.serialize());
                        LoadLink("contact-list");
                    });
                    $("#cancelButton").on("click", () => {
                        LoadLink("contact-list");
                    });
                }
                break;
        }
    }
    function AuthGuard() {
        let protected_routes = ["contact-list"];
        if (protected_routes.indexOf(router.ActiveLink) > -1) {
            if (!sessionStorage.getItem("user")) {
                router.ActiveLink = "login";
                console.log("auth guard working");
            }
        }
    }
    function DisplayLoginPage() {
        console.log("DisplayLoginPageCalled");
        let messageArea = $("#messageArea");
        messageArea.hide();
        $("#loginButton").on("click", function () {
            let success = false;
            let newUser = new core.User();
            $.get("./data/user.json", function (data) {
                let username = document.forms[0].username.value;
                let password = document.forms[0].password.value;
                for (const user of data.users) {
                    if (username === user.Username && password === user.Password) {
                        newUser.fromJSON(user);
                        success = true;
                        break;
                    }
                }
                if (success) {
                    sessionStorage.setItem("user", newUser.serialize());
                    messageArea.removeAttr("class").hide();
                    LoadLink("contact-list");
                    let user = sessionStorage.getItem("user")?.split(" ")[0] ?? null;
                    let linkItem = $("<li>").addClass("nav-item");
                    console.log(user);
                    let a = $("<a>").addClass("nav-link border border-danger border-2 rounded ").text(user);
                    $("ul li:last-child").before(linkItem.add(a));
                }
                else {
                    $("#username").trigger("focus").trigger("select");
                    messageArea.addClass("alert alert-danger").text("user is not exists").show();
                }
            });
        });
        $("#cancelButton").on("click", function () {
            document.forms[0].reset();
            location.href = "/";
        });
    }
    function CheckLogin() {
        if (sessionStorage.getItem("user")) {
            console.log("check login called");
            $("#login").html(`<a id="logout" class="nav-link" href="#"><i class="fas fa-sign-out-alt "></i>Logout</a>`);
        }
        $("#logout").on("click", function () {
            console.log("logout clicked");
            sessionStorage.clear();
            location.href = "/";
        });
    }
    function DisplayRegisterPage() {
        console.log("DisplayRegisterPageCalled");
        $("#").on("click", () => LoadLink("about"));
        $("#submitButton").on("click", (event) => {
            event.preventDefault();
            let firstName = document.forms[0].firstName.value;
            let emailAddress = document.forms[0].emailAddress.value;
            let lastName = document.forms[0].lastName.value;
            let password = document.forms[0].password.value;
            let newUser = new core.User(firstName, emailAddress, firstName + lastName, password);
            console.log(newUser.toString());
            $("form")[0].reset();
        });
        RegisterFormValidation();
    }
    function ActiveLinkCallback() {
        switch (router.ActiveLink) {
            case "home": return DisplayHomePage;
            case "about": return DisplayAboutPage;
            case "services": return DisplayServicePage;
            case "contact": return DisplayContactPage;
            case "contact-list": return DisplayContactListPage;
            case "edit": return DisplayEditPage;
            case "projects": return DisplayProjectPage;
            case "register": return DisplayRegisterPage;
            case "login": return DisplayLoginPage;
            case "404": return Display404;
            default:
                console.error("Error: callback does not " + router.ActiveLink);
                return new Function();
        }
    }
    function Display404() {
        console.log("4o4 called");
    }
    function LoadContent() {
        CheckLogin();
        let pageName = router.ActiveLink;
        let pageTitle = pageName.charAt(0).toUpperCase() + pageName.slice(1);
        let callback = ActiveLinkCallback();
        $.get(`./views/components/${pageName}.html`, function (html_data) {
            $("main").html(html_data);
            CheckLogin();
            callback();
        });
        $("title").text(pageTitle);
        console.log(`load content called for ${pageName}`);
    }
    function LoadFooter() {
        $.get("./views/components/footer.html", function (html_data) {
            $("footer").html(html_data);
            console.log("load footer called");
        });
    }
    function Start() {
        console.log("app started");
        LoadHeader();
        LoadLink("home");
        LoadFooter();
    }
    window.addEventListener("load", Start);
})();
//# sourceMappingURL=app.js.map