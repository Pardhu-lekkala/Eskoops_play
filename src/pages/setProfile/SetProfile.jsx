import React, { useState, useEffect } from "react";
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import logo from '../../static/images/logo.png';
import edit from '../../static/images/edit.png';
import {history} from '../../routers/history'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import useMediaQuery from "@material-ui/core/useMediaQuery";
import auth from '../../services/auth';
import CircularProgress from '@material-ui/core/CircularProgress';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}



const useStyles = makeStyles((theme) => ({


    leftContainer : {
        minHeight: "100vh",
        background: '#002146',
    },
    logo: {
      height: '4.5rem',
      width : '11.75rem',
      // paddingRight: '0.5rem',
      cursor: 'pointer',
      marginTop: '64px',
      marginLeft: '15%',
      // [theme.breakpoints.down('sm')]: {
      //   height: '26px',
      // },
    },
    circularLoader : {
      height:'30px',
      width:'30px',
      color:'white'
  },
    logoMobile: {
      marginLeft: '20px',
      marginTop:'4px',
      marginBottom: '4px'
    },
    edit : {
        textAlign : 'center'
    },
    textTop : {
      fontSize:'24px',
      color: "#FFFFFF",
      marginLeft: '15%',
      [theme.breakpoints.down('sm')]: {
        fontSize:'20px',
      },
  },
  imageContainer : {
    paddingBottom : '65%',
    width : '65%',
    background : '#8391A7',
    borderRadius: "8px"
},
imageAndTitle : {
  marginLeft : '28%'
},
    title : {
        fontSize:'24px', color:'#FFFFFF', textAlign:'center', margin: '16px', width : '60%'
    },
    button: {
        marginTop: theme.spacing(1),
        width: '100%',
        background: "#FE7300",
        "&:hover": {
          backgroundColor: "#FE7300"
      }
  

      },
   
   
  }));

const Profile = (props) => {
    const classes = useStyles({});
    const [emailAddress, setEmailAddress] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const [userName, setUserName] = useState('');
    const [image, setImage] = useState(edit);
    const [Uimage, setUImage] = useState(edit);
    const [error, setError] = useState(false);
    const [registerData, setRegisterdata] = useState(null);
    const [showLoader, setShowLoader] = useState(false);
    const [openAlert, setOpenAlert] = React.useState(false);

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
      if(props.location.accessCode && props.location.emailAddress){
        setAccessCode(props.location.accessCode)
        setEmailAddress(props.location.emailAddress)
      }
     
    }, []);

    const handleAlertClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
  
      setOpenAlert(false);
    };
    useEffect(() => {
      document.getElementsByClassName("control-dots")[0].style.bottom = '-14px';
      document.getElementsByClassName("control-dots")[0].style.right = '-18px';
    }, []);

   const handleSubmit = async () =>{
    setShowLoader(true)
     
      if(userName){
        if(accessCode){
          if(image!==edit){
          // setShowLoader(false)
            let registerRes = await auth.register({
              first_name : userName,
              email      : emailAddress,
              file    : Uimage,
              password   : 12345678,
              password_confirmation : 12345678,
              register_type    : "register",
            })

            if (registerRes.status) {
            history.push('/challenges')
            setError(false)
           } else {
            //console.log(registerRes.errors);
            setError(true)
          }

          
         
        }else{
          setError(true)
          setOpenAlert(true)
        }
      }
        setError(false)
        setShowLoader(false)
      }else{
        setError(true)
        setShowLoader(false)
      }
     
    }

  return (
    <div >
     { !matches ?
      <Grid container direction="row" justify="center" alignItems="center" >
      <Grid container item sm={4} className={classes.leftContainer}>
         <Grid item >
         <Typography
            variant='h3'
            color='inherit'
            noWrap
            className={classes.toolbarTitle}
          >
            <img
              src={logo}
              className={classes.logo}
              alt='logo'
              // onClick={() => history.push('/')}
            />
          </Typography>
          <Snackbar
                open={openAlert}
                autoHideDuration={6000}
                onClose={handleAlertClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                }}
              >
                <Alert onClose={handleAlertClose} severity="error">
                  Please upload a profile picture
                </Alert>
              </Snackbar>
          <Typography className={classes.textTop}>Create self run exciting team engagement activities with SKOOP.</Typography>
         </Grid>
         <Carousel showStatus={false} autoPlay={true} infiniteLoop={true}>
         <Grid item className={classes.imageAndTitle}>
            <Grid item><div className={classes.imageContainer}></div></Grid> 
             <Typography className={classes.title}>Title</Typography>
             <Typography style={{fontSize:'16px', color:'#FFFFFF', width: '80%',marginBottom:'20px',marginLeft:"-23px"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Typography>
         </Grid>
         <Grid item className={classes.imageAndTitle}>
            <Grid item><div className={classes.imageContainer}></div></Grid> 
             <Typography className={classes.title}>Title</Typography>
             <Typography style={{fontSize:'16px', color:'#FFFFFF', width: '80%',marginBottom:'20px',marginLeft:"-23px"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Typography>
         </Grid>
         <Grid item className={classes.imageAndTitle}>
            <Grid item><div className={classes.imageContainer}></div></Grid> 
             <Typography className={classes.title}>Title</Typography>
             <Typography style={{fontSize:'16px', color:'#FFFFFF', width: '80%',marginBottom:'20px',marginLeft:"-23px"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Typography>
         </Grid>
            </Carousel>
      </Grid>
      <Grid item sm={8}  container direction="row" justify="center" alignItems="center">
         <Grid item sm={3}></Grid>
         <Grid item sm={6}>
             <Typography style={{fontSize:'32px',textAlign:'center'}}>Set your profile</Typography>
             <Typography style={{fontSize:'18px',textAlign:'center'}}>
             <label for="file-input">
             <img
              src={image}
              className={classes.edit}
              alt='edit'
              style={{width:'100px',height:'100px',borderRadius:"50px"}}
              
              // onClick={() => history.push('/')}
            />
            </label>
           
             <input
              type="file"
              id="file-input"
              onChange={ (e)=>{
                setImage(URL.createObjectURL(e.target.files[0]))
                setUImage(e.target.files[0])
              }}
                
              hidden
            />
            </Typography>
             <Typography style={{fontSize:'14px', marginTop: '24px'}}>Name/Team Number</Typography>
             <TextField id="outlined-basic"  variant="outlined" autoComplete='off' style={{width:'100%'}}
              onChange ={(e)=>{setUserName(e.target.value.trim());setError(false)}} helperText={error ? "Please enter your name" : ''} error={error}
              onKeyPress=  {(e) =>{
                if (e.key === 'Enter') {
                handleSubmit() 
                }
              }}
              />
             <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick = { ()=>handleSubmit()  }
            >
                Continue<CircularProgress className={classes.circularLoader} style={{display:showLoader ? "block" :'none',width:"16px",height:"16px",marginLeft:"20px"}}/>
            </Button>
         </Grid>
         <Grid item sm={3}></Grid>
      </Grid>
      </Grid>  :

            <Grid container direction="column" justify="center"  >
            <Grid container item  direction="column" style={{display:'unset'}}>
              <Grid item xs={4} style={{ background: '#002146', maxWidth: "100%"}}>
              <Typography
            variant='h3'
            color='inherit'
            noWrap
            className={classes.toolbarTitle}
            >
            <img
              src={logo}
              className={classes.logoMobile}
              alt='logo'
              onClick={() => history.push('/')}
            />
            </Typography>
              </Grid>
              <Grid item style={{marginTop:'40px', marginLeft:'20px'}}>
              <Typography style={{fontSize:'32px', lineHeight:'44px', textAlign:'center'}}>Set your profile</Typography>
              <Typography style={{fontSize:'18px',textAlign:'center'}}>
              <label for="file-input">
             <img
              src={image}
              className={classes.edit}
              alt='edit'
              style={{width:'100px',height:'100px',borderRadius:"50px"}}
              
              // onClick={() => history.push('/')}
            />
            </label>
           
             <input
              type="file"
              id="file-input"
              onChange={(e)=>setImage(e.target.files[0])}
              hidden
            />
              </Typography>
              <Typography style={{fontSize:'14px', marginTop: '24px'}}>Name/Team Number</Typography>
              <TextField id="outlined-basic"  variant="outlined" autoComplete='off' style={{width:'95%'}}
              onChange ={(e)=>{setUserName(e.target.value.trim());setError(false)}} helperText={error ? "Please enter your name" : ''} error={error}
              onKeyPress=  {(e) =>{
                if (e.key === 'Enter') {
                  handleSubmit()
                }
              }}
              />
             <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                style={{width:'95%'}}
                onClick = { ()=>handleSubmit() }
            >
                Continue
            </Button>
            
              </Grid>
            </Grid>
            </Grid>

                }
  
  
 
      
    </div>
  );
};

export default Profile;