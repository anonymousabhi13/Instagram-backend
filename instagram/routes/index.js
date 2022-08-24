const express = require('express');
const router = express.Router();
const createrModel = require('./users');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const productSchema = require('./post');
passport.use(new localStrategy(createrModel.authenticate()));



router.get('/', function (req, res) {
  res.render('login');
});
router.get('/signup', function (req, res) {
  res.render('signup');
});

router.get('/home',isLoggedIn, function (req, res) {
  createrModel.findOne({ username: req.session.passport.user })
    .populate('mypost')
    .then(function (elem) {
      res.render('home', { elem })
      // console.log(elem);
    })
  // res.render('home');
});

router.get('/reset', function (req, res) {
  res.render('index',);
});

router.get('/like/:id', isLoggedIn, function (req, res) {
  createrModel.findOne({ username: req.session.passport.user })
    .then(function (foundUser) {
      productSchema.findOne({ _id: req.params.id })
        .then(function (post) {
          var index = post.like.indexOf(foundUser._id);
          if (index === -1) {
            post.like.push((foundUser._id));
          } else {
            post.like.splice(index, 1);
          }         
          post.save()
                   
            .then(function (hh) {
              res.redirect(req.headers.referer);
              console.log(hh);
            })
        })
    })
});


router.get('/comment', function (req, res) {
  res.render('comment');
})

router.post('/comment', isLoggedIn, function (req, res) {
  createrModel.findOne({ username: req.session.passport.user })
    .then(function (loginuser) {
      productSchema.create({
        Comment: req.body.Comment,      
        userid: loginuser._id

      })
        .then(function (pwu) {
        console.log(pwu);
          loginuser.mycomment.push(pwu._id)
          loginuser.save()
            .then(function (val) {
              res.redirect('/home');
              console.log(val);
            })
        })
    })
})


router.get('/create', function (req, res) {

  res.render('create');
})

router.post('/create', isLoggedIn, function (req, res) {
  createrModel.findOne({ username: req.session.passport.user })
    .then(function (loginuser) {
      productSchema.create({
        // product: req.body.productname,
        image: req.body.image,
        tags:req.body.tags,
        desc:req.body.desc,
        userid: loginuser._id
      })
        .then(function (pwu) {
          loginuser.mypost.push(pwu._id)
          loginuser.save()
            .then(function (val) {
              res.redirect('/home');
              console.log(val);
            })
        })
    })
})


router.post('/register', function (req, res) {
  const newUser = new createrModel({
    user: req.body.user,
    username: req.body.username
  })
  createrModel.register(newUser, req.body.password)
    .then(function (createdUser) {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/home')
      })
    })
    .catch(function (err) {
      res.send(err);
    })
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    res.redirect('/');
  }
}

// function check(req, res,next) {
//   if (!req.isAuthenticated()) {
//     return next();
//   }
//   else {
//     res.redirect('/home');
//   }
// }

router.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/'
}), function (req, res, next) { });

router.get('/logout', function (req, res, next) {
  req.logOut();
  res.redirect('/');
})
module.exports = router;

