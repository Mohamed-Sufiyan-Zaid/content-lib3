import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { getApiEndpointByProject } from "../utils/common";
import { HTTPMethods } from "../utils/constants";

// baseURL and headers to be updated as per requirement
export function axiosFn({ method = HTTPMethods.GET, url = "", params = {}, data = {}, project = "docAuth", contentType = "application/json" }) {
  return axios({
    method,
    url,
    baseURL: getApiEndpointByProject(project),
    data,
    params,
    headers: {
      "Content-Type": contentType
      //   "Authorization": `Bearer ${accessToken}`
    }
  });
}

// NOTE : queryKey should be used using enums QueryKeys defined in common types.ts
export function useFetcher({ url, queryKey, params, enableQuery, staleTime = 3000000, project = "docAuth", retry = 3 }) {
  // enableQuery : can be used when call is dependent on some condition
  return useQuery({
    queryKey: [...queryKey],
    queryFn: () => axiosFn({ method: HTTPMethods.GET, url, params, project }),
    enabled: enableQuery,
    select: (data) => data.data,
    staleTime,
    retry
  });
}

export function useModifier({ inValidateQueryKey, project = "docAuth", customOnSuccess = () => {}, handleCustomError = () => {} }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ method, url, data, params = {}, contentType = "application/json" }) =>
      axiosFn({ method, url, params, data, project, contentType }),
    onSuccess: ({ data }) => {
      customOnSuccess(data);
      queryClient.invalidateQueries({ queryKey: [...inValidateQueryKey] });
    },
    onError: (error) => {
      handleCustomError(error);
    }
  });
}

// queryClient.invalidateQueries makes a new get call after post call to update data
// queryClient.setQueryData can be used to directly update data without making a new get call if the post call returns the updated response
