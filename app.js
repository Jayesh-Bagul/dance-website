const express = require("express");
const path = require("path");
const app = express();
const port = 8000;
const mongoose = require('mongoose');
const bodyparser = require("body-parser")
mongoose.connect('mongodb://localhost/contactDance', {useNewUrlParser: true});//will create and connect to the contactDance database.
 
const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    address: String,
    desc: String

  });
// now wherever you want to create a new document or want to store a new document you will create using new Contact and it will create a document of format contactSchema. 
  const Contact = mongoose.model('Contact', contactSchema);

// EXPRESS SPECIFIC STUFF
app.use("/static",express.static("static"));
//express.static("static") is what actually serves the requested content from the given "static" directory. 
// // So, when a request is made to a path starting with '/static', Express will use the `express.static` middleware to serve the corresponding file from the 'static' directory. For instance, a request to '/static/image.jpg' will serve the 'image.jpg' file located in the 'static' directory.
app.use(express.urlencoded());

// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', path.join(__dirname, 'views')) // Set the views directory. Basically when below we use res.status(200).render("index.pug) then at that time because of this line express knows that where is the index.pug file is stored. More about this in the end:
// By setting 'views' to the specified directory (path.join(__dirname, 'views')), Express will know that views/templates for rendering HTML pages reside in the "views" directory. This configuration allows Express to locate and render these views when using template engines like Pug, EJS, Handlebars, etc., with functions like res.render() to generate HTML pages dynamically.

// ENDPOINTS
app.get('/', (req, res)=>{
    const params = {}
    res.status(200).render('home.pug', params);//initially here index.pug was written now home.pug. See more at the end. After complete filling base.pug is served to us in the website.
})

app.get('/contacts', (req, res)=>{
    const params = {}
    res.status(200).render('contact.pug', params);
})

app.post('/contacts', (req, res)=>{
    //here if you want to store the data to the database with the help of post request then you have to download a module named body-parser. 
    const params = {}
    var myData = new Contact(req.body);
myData.save().then(()=>{res.send("Item has been saved to the database")}).catch(()=>{res.send("Item has not been saved to the database")})


    // res.status(200).render('contact.pug', params);
})


// START THE SERVER
app.listen(port, ()=>{
    console.log(`The application started successfully on port ${port}`);
});
















//DIFFERENCE : 

// app.use(express.static("static",options) and app.use("/static", express.static("static"))
// Both `app.use(express.static("static", options))` and `app.use('/static', express.static('static'))` are used in Express.js to serve static files, but they differ in their behavior and how they handle requests.
// 1. **`app.use(express.static("static", options))`**:
//    - This middleware is used to serve static files directly from the directory specified. In this case, it serves files from the "static" directory.
//    - The `options` parameter is an optional argument where you can pass configuration settings for serving static files (e.g., setting cache control, headers, etc.).
//    - Requests for static files will be directly served from the specified directory without any additional URL path prefix.
// 2. **`app.use('/static', express.static('static'))`**:
//    - This middleware also serves static files, but it serves them with a specified base URL path prefix ("/static").
//    - It means that when a request comes in for a static file, Express will check if the URL starts with "/static" and, if so, serve the corresponding file from the "static" directory.
//    - The base URL path ("/static") acts as a route prefix for serving static files. For example, a request to "/static/image.jpg" will look for the "image.jpg" file in the "static" directory.
// In summary, the difference lies in how the URL paths are handled:
// - The first method serves static files directly from the specified directory without any URL prefix.
// - The second method serves static files with a specified base URL path prefix ("/static").



// WORKING OF app.use(express.static("static", options)):

// Yes, that's correct! The `express.static()` middleware in Express serves static files without requiring a specific route path (like `/static`) in the URL. 
// When you use `app.use(express.static("static"))`, it serves static files directly from the "static" directory without needing any additional path prefix in the URL.
// For instance, if you have an image file named "image.jpg" in the "static" directory, accessing `http://yourdomain.com/image.jpg` will directly serve that file without needing `/static` in the URL. Express will check if "image.jpg" exists in the "static" directory and serve it if found, regardless of the path in the URL.
// This middleware serves static files from the specified directory for any matching requests without requiring a specific path prefix, making it convenient for serving CSS, JavaScript, images, and other static assets in your application.


// VIEWS : app.set(views, path.join(__dirname, "views")):

// In Express.js, `app.set('views', path.join(__dirname, 'views'))` is used to configure the directory where your application's views (templates) are located.
// - `app.set('views', ...)` is a method used to set application settings in Express.
// - `'views'` is the setting key used to specify the directory where views/templates are stored.
// - `path.join(__dirname, 'views')` is the value assigned to the `'views'` setting. Here, `path.join()` is a Node.js method used to construct file paths by joining segments together.
// The `path.join(__dirname, 'views')` part constructs an absolute path to the "views" directory relative to the current directory (`__dirname`). It's a way to ensure that regardless of the current working directory, Express knows where to look for the views.
// By setting `'views'` to the specified directory (`path.join(__dirname, 'views')`), Express will know that views/templates for rendering HTML pages reside in the "views" directory. This configuration allows Express to locate and render these views when using template engines like Pug, EJS, Handlebars, etc., with functions like `res.render()` to generate HTML pages dynamically.





// HOME.pug vs INDEX.pug
// initially here index.pug was written now home.pug. See more at the end.
// base.pug is like a normal form in which name, class, roll no., etc. is written where as home.pug will be different everytime and it is something that will fill the form base.pug. And after complete filling base.pug is served to us in the website.
