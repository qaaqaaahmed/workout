import { PAGINATION } from "@/config/constants";
import { useEffect, useState } from "react";

interface UseEntitySearchProps<
  T extends {
    search: string;
    page: number;
  },
> {
  params: T;
  setParams: (params: T) => void;
  debounceMs?: number;
}

// 1. If input was cleared → clear the real search url immediately.

// 2. Otherwise set a timer that waits 500ms → if localSearch and params.search differ, sync params.search to localSearch.

// 3. another effect -> If params.search changes externally → sync localSearch to it.
export function useEntitySearch<T extends { search: string; page: number }>({
  params,
  setParams,
  debounceMs = 500,
}: UseEntitySearchProps<T>) {
  const [localSearch, setLocalSearch] = useState(params.search);

  useEffect(() => {
    //user cleared the input but there is something in the url, we need to clear the url and just return
    if (localSearch === "" && params.search !== "") {
      setParams({
        ...params,
        search: "",
        page: PAGINATION.DEFAULT_PAGE,
      });
      return;
    }

    // if localSearch differs from params.search, sync it after the debounce
    const timer = setTimeout(() => {
      if (localSearch !== params.search) {
        setParams({
          ...params,
          search: localSearch,
          page: PAGINATION.DEFAULT_PAGE,
        });
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [debounceMs, localSearch, params, setParams]);

  // if for whatever reason user updates the search from the url then we update the localsearch to be in sync with it
  useEffect(() => {
    //you want to know why we have a seperate effect for this? well read below
    //if you were to out this in the first effect then you would send the timer and before it even does anything,
    // you would setLocalSearch to the currentvalue of params.search[which is before timer was sent] thereby resetting what user typed
    //and cancelling the old timer.

    // user types a, localSearch = "a" then the first if is only to clear so it doesnt run,
    // it goes and schedules a timer, then imagine this is after the timer line, what happens?
    //well, params.search = "", thereby setting localSearch = "", which rerenders the component, the effect runs, the old timer is cancelled,
    // and its like the user never typed
    setLocalSearch(params.search);
  }, [params.search]);

  return {
    searchValue: localSearch,
    onSearchValue: setLocalSearch,
  };
}
