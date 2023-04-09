    /*
    * WebD6201
    * Name - Prerakkumar Patel (100846056)
    * DatE - FEB 24, 2023
    * * */
    "use strict";
    /// IIFE Function
    (function () {
        // Display home page
       function DisplayHomePage():void {
            console.log("home page called");
            $("#AboutUsBtn").on("click", () => location.href = "/about");
            $("main").append(`<article class="container"><p id="ArticleParagraph" class="mt-3">This is Article paragraph</p> </article>`)
            $("main").append(`<p class="mt-3" id="MainParagraph">This is jquery generated paragraph</p> `);

        }



        // Displaying product page
        function DisplayProjectPage() :void{
            console.log("Display project page called");

        }

        // Displaying service page
        function DisplayServicePage():void {
            console.log("Display Service page called");
        }


        // Displaying about page
        function DisplayAboutPage():void {
            console.log("Display About page called");

        }

        // Validations for register page
        function RegisterFormValidation():void{
            // passing regEX parameters in function to validate input fields with appropriate error messages.
            ValidateField("#firstName",/^[a-zA-Z]{2,}$/,"Please enter valid first name more than 1 letter");
            ValidateField("#lastName",/^[a-zA-Z]{2,}$/,"Please enter valid  last name more than 1 letter");
            ValidateField("#emailAddress",/^([a-zA-Z0-9._-]{3,20})+(@[a-zA-Z0-9._-]{2,20})+\.[a-zA-Z]{3,20}$/,"Please enter valid email address");

        }

        // Validations for contact form
        function ContactFormValidation():void{
            ValidateField("#fullName",/^([A-Za-z]{1,3}\.?\s)?([A-Za-z]+)+([\s,-]([A-za-z]+))*$/,"Please enter valid  name as ( First Mid Last )  ");
            ValidateField("#contactNumber", /^([0-9]{10})$/,"Please enter valid contact number of 10 digits ");
            ValidateField("#emailAddress",/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/,"Please enter valid email address");
        }

        // Dispalying contact page
        function DisplayContactPage():void {
            console.log("Display Contact page called");

            let sendButton = document.getElementById("sendButton") as HTMLElement ;
            let subscribeCheckbox = document.getElementById("subscribeCheckbox") as HTMLInputElement;
            sendButton.addEventListener("click",  (e)=> {
                e.preventDefault();
                console.log("submit  button is clicked");

                if (subscribeCheckbox.checked ) {
                    let fullName = document.forms[0].fullName.value;
                    let contactNumber = document.forms[0].contactNumber.value;
                    let emailAddress = document.forms[0].emailAddress.value;
                    $("#contactpage").submit();

                }


            });
            ContactFormValidation();
        }

        // Adding contact
         function AddContact(fullName:string,contactNumber:string,emailAddress:string):void{
            let contact = new core.Contact(fullName, contactNumber, emailAddress);
            if (contact.serialize()) {
                let key = contact.FullName.substring(0,1) + Date.now();
                localStorage.setItem(key, contact.serialize() as string);
            }

        }

        // Displaying Contact list Page
        function DisplayContactListPage(): void {
            console.log("ContactList Page");

            $("a.delete").on("click", function (event) {
                //confirm delete
                if (!confirm("Delete contact, are you sure?")) {
                    event.preventDefault();
                    location.href = "/contact-list";
                }
            });

        }
        // Validating fields using regEX
        function ValidateField(input_field_id: string, regular_expression: RegExp, error_message: string): void {
            const messageArea = $("#messageArea").hide();
            $(input_field_id).on("blur", function () {
                const inputFieldText = $(this).val() as string;
                if (!regular_expression.test(inputFieldText)) {
                    $(this).trigger("focus").trigger("select");
                    messageArea.addClass("alert alert-danger").text(error_message).show();
                } else {
                    messageArea.removeAttr("class").hide();
                }
            });

            // Validating password field
            $("#password").on("blur", function () {
                if (($("#password").val()as string).length  < 0 ) {
                    messageArea.removeAttr("class").hide();
                } else if (($("#password").val() as string).length < 6 ) {
                    messageArea.addClass("alert alert-danger").text("Password must be at least 6 letters").show();
                }  else {
                    messageArea.removeAttr("class").hide();
                }
            });
            $("#confirmPassword").on("blur", function () {
                if (($("#confirmPassword").val()as string).length < 0 ) {
                    messageArea.removeAttr("class").hide();
                } else if (($("#confirmPassword").val() as string).length < 6 ) {
                    messageArea.addClass("alert alert-danger").text("Confirm password must be at least 6 letters").show();
                } else if ($("#confirmPassword").val() !== $("#password").val()) {
                    messageArea.addClass("alert alert-danger").text("Passwords must match").show();
                } else {
                    messageArea.removeAttr("class").hide();
                }
            });
        }




        // Displaying edit page
        function DisplayEditPage(): void {
            console.log("Edit Contact Page");
            ContactFormValidation();
        }

        function AuthGuard():void{
            let protected_routes:string[]=["/contact-list","/edit"];
            if(protected_routes.indexOf(location.pathname)>-1){
                if(!sessionStorage.getItem("user")){
                    location.href="/login";
                    console.log("auth guard working");
                }}
        }

        function  DisplayLoginPage()
        {
            console.log("DisplayLoginPageCalled");

             let messageArea= $("#messageArea");
             messageArea.hide();
            $("#loginButton").on("click",function (){

                let success = false;
                let newUser = new core.User();
                $.get("./data/user.json",function (data){

                    let username = document.forms[0].username.value;
                    let password = document.forms[0].password.value;
                   for(const user of data.users){

                       if(username === user.Username && password === user.Password){
                           newUser.fromJSON(user);
                           success=true;
                           break;
                       }
                   }

                   if(success){
                       sessionStorage.setItem("user",newUser.serialize() as string);
                       messageArea.removeAttr("class").hide();   

                       location.href = "/contact-list";
                       let user: string | null = sessionStorage.getItem("user")?.split(" ")[0] ?? null;
                       let linkItem = $("<li>").addClass("nav-item");
                       console.log(user);
                       let a = $("<a>").addClass("nav-link border border-danger border-2 rounded ").text(user as string);

                       $("ul li:last-child").before(linkItem.add(a));


                   }else {
                       $("#username").trigger("focus").trigger("select");
                       messageArea.addClass("alert alert-danger").text("user is not exists").show();

                   }
                });
            });
            $("#cancelButton").on("click",function (){
                document.forms[0].reset();
                location.href ="/";
            });


        }

        // Checking for user login
        function CheckLogin():void{
            if(sessionStorage.getItem("user")) {
                console.log("check login called");

                $("#login").html(`<a id="logout" class="nav-link" href="#"><i class="fas fa-sign-out-alt "></i>Logout</a>`)



            }
            $("#logout").on("click",function () {
                console.log("logout clicked");
                sessionStorage.clear();
                location.href = "/";

            });
        }

        // Displaying register page
        function  DisplayRegisterPage()
        {
            // displaying function name in console
            console.log("DisplayRegisterPageCalled");
            $("#").on("click", () => location.href = "/about"
            );
            // submit button clicked
            $("#submitButton").on("click",(event)=>{
                event.preventDefault();

                let firstName = document.forms[0].firstName.value;
                let emailAddress = document.forms[0].emailAddress.value;
                let lastName = document.forms[0].lastName.value;
                let password = document.forms[0].password.value;

                let newUser = new core.User(firstName ,emailAddress,firstName+lastName,password);
                console.log(newUser.toString());
                ($("form")[0] as HTMLFormElement).reset();

            });
            // calling function to validate the form
            RegisterFormValidation();

            //
        }

        function Display404():void
        {
            console.log("4o4 called")
        }



        // Start Function
        function Start(){

            console.log("app started");

            let page_id =$("body")[0].getAttribute("id");
            CheckLogin();
            switch (page_id)
            {
                case "home": DisplayHomePage(); break;
                case "about": DisplayAboutPage(); break;
                case "services": DisplayServicePage(); break;
                case "contact":  DisplayContactPage(); break;
                case "contact-list":   DisplayContactListPage(); break;
                case "edit": DisplayEditPage(); break;
                case "add": DisplayEditPage(); break;
                case "projects":  DisplayProjectPage(); break;
                case "register":  DisplayRegisterPage(); break;
                case "login":  DisplayLoginPage(); break;
                case "404":  Display404(); break;
                default:
                    console.error("Error: callback does not "+ router.ActiveLink);


            }

        }

        window.addEventListener("load", Start);


    })()