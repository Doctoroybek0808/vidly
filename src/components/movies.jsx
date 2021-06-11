import React, { Component } from 'react';
import ListGroup from './common/listGroup'
import {deleteMovie, getMovies} from '../services/movieService'
import {getGenres} from '../services/genreService'
import Pagenation from '../components/common/pagination';
import {paginate} from '../utils/paginate'
import MoviesTable from './moviesTable';
import _ from 'lodash'
import { Link } from 'react-router-dom';
import SearchBox from './common/searchBox';
import { toast } from 'react-toastify';
class Movies extends Component {
    state = {
        movies:[],
        genres: [],
        pageSize: 4,
        currentPage:1,
        selectedGenre:'',
        searchQuery:'',
        sortColumn:{path:'title', order:'asc'}
      }
      async componentDidMount(){
       const {data} = await getGenres()
       
        const genres = [{_id:'', name:'All Genres'}, ...data];
        const {data:movies} = await getMovies();
        this.setState({movies, genres })
      }
      handleDelete= async (movie)=>{
        const originalMovies = this.state.movies;
        const movies = this.state.movies.filter(m=> m._id !== movie._id);
        try
        {
          await deleteMovie(movie._id);
        }
        catch(ex)
        {
          console.log(ex.response)
          if(ex.response && ex.response.status === 404)
            toast.error('This movie has already been deleted.')
          
          this.setState({movies:originalMovies})
        }
        this.setState({movies})
      }
      handleSearch= query =>{
        this.setState({searchQuery:query, selectedGenre:null, currentPage:1})
      }
      handePageChange = page =>{
        this.setState({currentPage: page})
      }
      handeGenreSelect= genre =>{          
       this.setState({currentPage:1, searchQuery:'', selectedGenre:genre})
      }
      handeLike= (movie)=>{
          const movies = [ ...this.state.movies]
          const index = movies.indexOf(movie)
          movies[index] = {...movies[index]}
          movies[index].liked = !movies[index].liked
          this.setState({movies})
      }
      handleSort=sortColumn=>{    
        this.setState({sortColumn})
      }
      getPagedData=()=>{
        const {
            pageSize, 
            currentPage, 
            selectedGenre, 
            sortColumn, 
            searchQuery,
            movies:allMovies
        } = this.state;

        let filtered = allMovies;
        if(searchQuery)
          filtered = allMovies.filter(m=>m.title.toLowerCase().startsWith(searchQuery.toLowerCase()));
        else if(selectedGenre && selectedGenre._id)
          filtered = allMovies.filter(m=>m.genre._id === selectedGenre._id);
        
        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])

        const movies = paginate(sorted, currentPage, pageSize);
        return {totalCount: filtered.length, data:movies, searchQuery}
      }
    render() { 
        const {length: count} = this.state.movies ;
        const {pageSize, currentPage,sortColumn, movies:allMovies} = this.state;
        if(count === 0) return <p>There are no movies in the databases</p>
       
        const {totalCount, data:movies, searchQuery} = this.getPagedData();


        return  (
            <div className="row">
                <div className="col-3">
                    <br/>
                    <ListGroup 
                        items={this.state.genres}
                        selectedItem={this.state.selectedGenre}
                        onItemSelect={this.handeGenreSelect}
                    />
                </div>
                <div className="col">
                <Link
                  to="/movies/new"
                  className='btn btn-primary'
                  style={{marginBottom:20}}>New Movie</Link>
                <p>There are {totalCount} movies in the databases</p>
                <SearchBox value={searchQuery} onChange={this.handleSearch}/>
                <MoviesTable
                    movies={movies}
                    sortColumn={sortColumn}
                    onLike={this.handeLike}
                    onDelete={this.handleDelete}
                    onSort={this.handleSort}
                />
                <Pagenation 
                    itemsCount={totalCount} 
                    pageSize={pageSize}
                    currentPage={currentPage} 
                    onPageChange={this.handePageChange}/>
                </div>
               
            </div>
        )
    }        
}
 
export default Movies;