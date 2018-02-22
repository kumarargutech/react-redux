
export const FETCH_PERSONAL_DATA = 'FETCH_PERSONAL_DATA';
export const data = [{
    'id' : 1,
    'name' : 'Kumar',
    'source' : 'ReactJS'
 },
 {
  'id' : 2,
  'name' : 'Santhosh',
  'source' : 'ReactJS'
}];

export const getData = (data) => ({
    type: FETCH_PERSONAL_DATA,
    data:data,
    isRefreshingData: false
})
