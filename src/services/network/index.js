import _superagent from 'superagent';
import {history} from '../../routers/history'
import auth  from '../auth'

// const superagent = _superagent;
// with this even the regular request fail!! WHY??
const superagent = _superagent.agent().use(function (req) {
  req.on('response', (res)=> {
    if (res.status === 401) {
      console.dir('Unauthorized Request: calling refresh token api');
      console.log('checking retry',req);
      auth.refreshToken().then(refRes=>{
        console.log({refRes});
        if(refRes.status){
          console.log('refresh token fetched');
        }else{
          console.log('refresh token erred out');
          history.push('/about')
  
        }
      });
      
    }
  });
});

export default _superagent;