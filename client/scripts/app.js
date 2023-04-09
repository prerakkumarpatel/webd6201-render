"use strict";
(function () {
    function DisplayHomePage() {
        console.log("home page called");
        $("#AboutUsBtn").on("click", () => location.href = "/about");
        $("main").append(`<article class="container"><p id="ArticleParagraph" class="mt-3">This is Article paragraph</p> </article>`);
        $("main").append(`<p class="mt-3" id="MainParagraph">This is jquery generated paragraph</p> `);
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
        ValidateField("#fullName", /^([A-Za-z]{1,3}\.?\s)?([A-Za-z]+)+([\s,-]([A-za-z]+))*$/, "Please enter valid  name as ( First Mid Last )  ");
        ValidateField("#contactNumber", /^([0-9]{10})$/, "Please enter valid contact number of 10 digits ");
        ValidateField("#emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, "Please enter valid email address");
    }
    function DisplayContactPage() {
        console.log("Display Contact page called");
        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");
        sendButton.addEventListener("click", (e) => {
            e.preventDefault();
            console.log("submit  button is clicked");
            if (subscribeCheckbox.checked) {
                let fullName = document.forms[0].fullName.value;
                let contactNumber = document.forms[0].contactNumber.value;
                let emailAddress = document.forms[0].emailAddress.value;
                $("#contactpage").submit();
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
        console.log("ContactList Page");
        $("a.delete").on("click", function (event) {
            if (!confirm("Delete contact, are you sure?")) {
                event.preventDefault();
                location.href = "/contact-list";
            }
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
        console.log("Edit Contact Page");
        ContactFormValidation();
    }
    function AuthGuard() {
        let protected_routes = ["/contact-list", "/edit"];
        if (protected_routes.indexOf(location.pathname) > -1) {
            if (!sessionStorage.getItem("user")) {
                location.href = "/login";
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
                    location.href = "/contact-list";
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
        $("#").on("click", () => location.href = "/about");
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
    function Display404() {
        console.log("4o4 called");
    }
    function Start() {
        console.log("app started");
        let page_id = $("body")[0].getAttribute("id");
        CheckLogin();
        switch (page_id) {
            case "home":
                DisplayHomePage();
                break;
            case "about":
                DisplayAboutPage();
                break;
            case "services":
                DisplayServicePage();
                break;
            case "contact":
                DisplayContactPage();
                break;
            case "contact-list":
                DisplayContactListPage();
                break;
            case "edit":
                DisplayEditPage();
                break;
            case "add":
                DisplayEditPage();
                break;
            case "projects":
                DisplayProjectPage();
                break;
            case "register":
                DisplayRegisterPage();
                break;
            case "login":
                DisplayLoginPage();
                break;
            case "404":
                Display404();
                break;
            default:
                console.error("Error: callback does not " + router.ActiveLink);
        }
    }
    window.addEventListener("load", Start);
})();
//# sourceMappingURL=app.js.map