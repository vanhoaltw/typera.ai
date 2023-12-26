import { CONTINUE_RUN, RESEARCH, START_RUN } from "@/graphql/research";
import { useMutation, useQuery } from "@apollo/client";
import { useDebouncedCallback } from "use-debounce";
import { useParams } from "react-router-dom";
import { getUniqueID } from "@/utils/fingerprint";
import { useGeneralStore } from "@/store/general";
import { getFileId } from "@/utils/common";
import { useEffect, useState } from "react";

export const useStartResearch = (mutateOptions = {}) => {
	const [mutate, { loading, data }] = useMutation(START_RUN, mutateOptions);

	const doRequest = useDebouncedCallback(async (options) => {
		const visitorId = getUniqueID();
		await mutate({
			variables: {
				researchId: 1,
				identifier: visitorId,
			},
			...options,
		});
	}, 250);

	return { doRequest, loading, data };
};

export const useContinueResearch = () => {
	return useMutation(CONTINUE_RUN);
};

export const useResearch = () => {
	const { id } = useParams();
	return useQuery(RESEARCH, {
		variables: { uuid: id },
		skip: !id,
	});
};
