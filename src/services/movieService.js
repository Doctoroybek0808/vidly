import axios from 'axios'
import {apiUrl} from '../config.json'
const apiEndpoint = apiUrl + "/movies"

function MovieUrl(id) {
    return `${apiEndpoint}/${id}`
}
export function  getMovies() {
    return axios.get(apiEndpoint)
}

export function  getMovie(movieId) {
    return axios.get(MovieUrl(movieId))
}
export function  saveMovie(movie) {
    if(movie._id){
        const body = {...movie}
        delete body._id;
        return axios.put(MovieUrl(movie._id), body)
    }
    return axios.post(apiEndpoint, movie)
}

export function  deleteMovie(movieId) {
    return axios.delete(MovieUrl(movieId))
}
  