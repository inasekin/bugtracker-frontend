
import { serverUrl } from './server-url'

//  type fromJsonFunc<T> = (name: any) => T;
//  async function fetchData<T>(url: string, setData: React.Dispatch<React.SetStateAction<T>>, fromJson : fromJsonFunc<T>) 
//  {
//     const serverUrl = 'http://localhost:5000' + url;
//     const response = await fetch(serverUrl, {
//         method: "GET",
//         mode: 'cors'
//     });
//     const json = await response.json();
//     setData(fromJson(json) as T);
// }

export async function fetchData<T>(url: string, setData: React.Dispatch<React.SetStateAction<T>>) 
{
    const requestUrl = serverUrl + url;
    const response = await fetch(requestUrl, {
       method: "GET",
       credentials: "include",
       mode: 'cors' // для тестов с другого домена
   });
   console.log(response.statusText);
   const json = await response.json();
   setData(json as T);
}

export async function putData<T>(url: string, data : T)
{
    const requestUrl = serverUrl + url;
    const response = await fetch(requestUrl, {
        method: "PUT",
        mode: 'cors', // для тестов с другого домена
        credentials: "include",
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    console.log(response.statusText);
};

export async function postData<T>(url: string, data : T)
{
    const requestUrl = serverUrl + url;
    const response = await fetch(requestUrl, {
        method: "POST",
        credentials: "include",
        mode: 'cors', // для тестов с другого домена
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    console.log(response.statusText);
    const result = await response.json();
    console.log(result);
};

export async function deleteData(url: string)
{
    const requestUrl = serverUrl + url;
    const response = await fetch(requestUrl, {
        method: "DELETE",
        credentials: "include",
        mode: 'cors' // для тестов с другого домена
    });
    console.log(response.statusText);
};
