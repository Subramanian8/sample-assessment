import fetch from 'isomorphic-fetch';
import * as cons from '../constants/app_constants.js'


export default {
	// call the getitems service to get datas from server
    getItemList(cb) {
        fetch(cons.API_URL + 'api/getitems', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(resp => resp.json())
            .then(data => {
                if(data.status == cons.SUCCESS) {
                    cb(true, data.result);
                } else {
                    cb(false, data);
                }
            }).catch(data => {
            cb(false, data);
        });
    }
}