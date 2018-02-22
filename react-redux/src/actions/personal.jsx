
export const FETCH_PERSONAL_DATA = 'FETCH_PERSONAL_DATA';
export const data = [{
    'id' : 1,
    'name' : 'Kumar R',
    'source' : 'ReactJS'
 },
 {
  'id' : 2,
  'name' : 'Santhosh',
  'source' : 'ReactJS'
}];


export const getData = () => ({
    type: FETCH_PERSONAL_DATA,
    data:data,
    isRefreshingData: false
})
