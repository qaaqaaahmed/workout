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

// 2. Otherwise wait 500ms → if localSearch and params.search differ, sync params.search to localSearch.

// 3. If params.search changes externally → sync localSearch to it.
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

  //if for whatever reason user updates the search from the url then we update the localsearch to be in sync with it
  useEffect(() => {
    setLocalSearch(params.search);
  }, [params.search]);

  return {
    searchValue: localSearch,
    onSearchValue: setLocalSearch,
  };
}

// const users = [
//   {
//     id: 1,
//     name: "Mike",
//     age: 31,
//   },
//   {
//     id: 2,
//     name: "John",
//     age: 30,
//   },
// ];

// const userToReplace = { id: 2, name: "Johnny", age: 28 };

// function replaceById<T extends { id: number }>(
//   users: T[],
//   userToReplace: T,
// ): T[] {
//   return users.map((user) =>
//     user.id === userToReplace.id ? userToReplace : user,
//   );
// }

// const updatedUsers = replaceById(users, userToReplace);

// console.log(updatedUsers);
