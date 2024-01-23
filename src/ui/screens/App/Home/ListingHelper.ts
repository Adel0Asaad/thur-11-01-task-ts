import { useEffect, useState } from "react";
import { useDebounce } from "../../../../util/Debounce";
import { useAppDispatch, useAppSelector } from "../../../../store/redux/hooks";
import { MediaType } from "../../../../services/types";
import {
  discoverMovieUrl,
  discoverSeriesUrl,
  movieGenresUrl,
  seriesGenresUrl,
} from "../../../../services/tmdbAPI/apiHelper";
import { useFetchMediaList } from "../../../../services/tmdbAPI/useFetchMediaList";
import { Movie } from "../../../../models/movie";
import { Series } from "../../../../models/series";
import {
  addMovieList,
  setMovieList,
} from "../../../../store/redux/slices/movieSlice";
import {
  addSeriesList,
  setSeriesList,
} from "../../../../store/redux/slices/seriesSlice";
import { useFetchGenreList } from "../../../../services/tmdbAPI/useFetchGenreList";
import { MediaGenre } from "../../../../models/genres";

export const useListingHook = (mediaType: MediaType) => {
  //

  ////////////////////////// MTYPE //////////////////////////
  const isMediaMovies = mediaType === "Movies";
  const setMediaList = (listToBeSet: ArrayLike<Movie | Series>) => {
    isMediaMovies
      ? dispatch(setMovieList(listToBeSet as Movie[]))
      : dispatch(setSeriesList(listToBeSet as Series[]));
  };
  const addMediaList = () => {
    isMediaMovies
      ? dispatch(addMovieList(mediaList as Movie[]))
      : dispatch(addSeriesList(mediaList as Series[]));
  };
  const mediaUrl = isMediaMovies ? discoverMovieUrl : discoverSeriesUrl;
  const genresUrl = isMediaMovies ? movieGenresUrl : seriesGenresUrl;
  const dispatch = useAppDispatch();
  ////////////////////////// MTYPE //////////////////////////

  //

  ////////////////////////// UI-Info //////////////////////////
  const [UIParams, setUIParams] = useState<{
    curPage: number;
    selectedGenres?: number[];
    searchText?: string;
  }>({curPage: 1});
  ////////////////////////// UI-Info //////////////////////////
  ////////////////////////// PAGES //////////////////////////
  const mediaListScrollEndHandler = () => {
    if (!mediaListLoading) {
      setUIParams((prevParams) => {
        console.log("Pagination update of " + mediaType);
        let newParams = { ...prevParams };
        newParams.curPage += 1;
        console.log("curPage is now: " + UIParams.curPage);
        return newParams;
      });
    }
  };

  useEffect(() => {
    if (UIParams.selectedGenres !== undefined && UIParams.searchText !== undefined) {
      console.log("Loading data!")
      loadMedia(UIParams.curPage, UIParams.selectedGenres, UIParams.searchText);
    }
  }, [UIParams]);
  ////////////////////////// PAGES //////////////////////////

  //

  ////////////////////////// GENRES //////////////////////////
  const [genreList, genreListError, genreListLoading] = useFetchGenreList(
    genresUrl,
    []
  );
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const appliedGenreFilter = useDebounce(selectedGenres, 500);

  const toggleGenre = (id: number) => {
    setSelectedGenres((prevList) => {
      return prevList.includes(id)
        ? prevList.filter((item) => item !== id)
        : [...prevList, id];
    });
  };

  useEffect(() => {
    // maybe check for if search text is empty
    setMediaList([]);
    setUIParams((prevParams) => {
      console.log("Genre update of " + mediaType);
      let newParams = { ...prevParams };
      newParams.curPage = 1;
      newParams.selectedGenres = appliedGenreFilter;
      return newParams;
    });
  }, [appliedGenreFilter]);
  ////////////////////////// GENRES //////////////////////////

  //

  ////////////////////////// MEDIA ///////////////////////////
  const [mediaList, mediaListError, mediaListLoading, loadMedia] = isMediaMovies
    ? useFetchMediaList<Movie>(mediaUrl, [])
    : useFetchMediaList<Series>(mediaUrl, []);

  const filteredMediaList = useAppSelector((state) =>
    isMediaMovies ? state.movieData.movieList : state.seriesData.seriesList
  );
  useEffect(() => {
    if (mediaList.length) {
      console.log("Adding media list");
      addMediaList();
    }
  }, [mediaList]);
  ////////////////////////// MEDIA ///////////////////////////

  //

  ////////////////////////// SEARCH //////////////////////////
  const [searchText, setSearchText] = useState("");
  const appliedTextFilter = useDebounce(searchText, 500);

  useEffect(() => {
    setMediaList([]);
    setUIParams((prevParams) => {
      console.log("FilterText update of " + mediaType);
      let newParams = { ...prevParams };
      newParams.curPage = 1;
      newParams.searchText = appliedTextFilter;
      return newParams;
    });
  }, [appliedTextFilter]);

  ////////////////////////// SEARCH //////////////////////////

  /////////////////////////////////////////////////////////////// DEBUGGING ///////////////////////////////////////////////////////////////
  useEffect(() => {
    if (genreListError !== null) {
      let consType = isMediaMovies ? "movies: " : "series: ";
      console.log("Error loading genres of " + consType + genreListError);
    }
  }, [genreListError]);
  useEffect(() => {
    if (mediaListError !== null) {
      let consType = isMediaMovies ? "movies: " : "series: ";
      console.log("Error loading list of " + consType + mediaListError);
    }
  }, [mediaListError]);
  /////////////////////////////////////////////////////////////// DEBUGGING ///////////////////////////////////////////////////////////////

  //

  return [
    filteredMediaList,
    mediaListLoading,
    genreList,
    genreListLoading,
    toggleGenre,
    searchText,
    setSearchText,
    mediaListScrollEndHandler,
  ];
};
