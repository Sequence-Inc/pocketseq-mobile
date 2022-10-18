import { RouteProp, useRoute } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import React, { useCallback, useEffect, useState } from "react";
import { Text, View, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResources } from "../../../resources";
import {
  SearchResult,
  ISearchScreenProps,
  ISearchScreenParams,
  SpaceSearchFilterOptions,
  HotelSearchFilterOptions,
} from "../search-helpers";
import { FullScreenActivityIndicator } from "../../../widgets/full-screen-activity-indicator";
import { useAlgolia } from "../../../services/algolia";
import { isEmpty } from "lodash";
import { FlatList } from "react-native-gesture-handler";
import { SearchListItem } from "../../../widgets/search-list-item";
import { SearchHeaderItem } from "../../../widgets/search-header-item";

export const SearchResultScreen: React.FC<ISearchScreenProps> = ({
  coordinator,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [params, setParams] = useState<ISearchScreenParams>();
  const [searchResult, setSearchResult] = useState<SearchResult[] | undefined>(
    []
  );
  const [searchResultHits, setSearchResultHits] = useState<number>();

  const route: RouteProp<{ params: ISearchScreenParams }> = useRoute();
  const headerHeight = useHeaderHeight();
  const { colors, images } = useResources();
  const { spaceIndex, hotelIndex } = useAlgolia();

  const search = useCallback(async () => {
    try {
      if (route.params?.searchType === "SPACE") {
        // Search space index
        const result = await spaceIndex?.search("", params);
        setSearchResult(result?.data);
        setSearchResultHits(result?.hits);
      } else {
        // Search hotel index
        const result = await hotelIndex?.search("", params);
        setSearchResult(result?.data);
        setSearchResultHits(result?.hits);
      }
      setLoading(false);
    } catch (error: any) {
      Alert.alert(error.message);
    }
  }, [params]);

  useEffect(() => {
    updateParams(route.params);
  }, []);

  useEffect(() => {
    if (!isEmpty(params)) {
      search();
    }
  }, [params]);

  const updateParams = (data: ISearchScreenParams) => {
    const newParams = { ...params, ...data };
    setParams(newParams);
  };

  if (loading) {
    return <FullScreenActivityIndicator />;
  }

  const handleFilterUpdate = (
    data: SpaceSearchFilterOptions & HotelSearchFilterOptions
  ): void => {
    updateParams(data);
  };

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={{
        backgroundColor: colors.background,
        paddingTop: headerHeight,
        flex: 1,
      }}
    >
      <FlatList
        style={{ backgroundColor: colors.backgroundVariant }}
        data={searchResult}
        ItemSeparatorComponent={() => {
          return (
            <View
              style={{
                height: 0,
                borderTopWidth: 1,
                borderTopColor: "#efefef",
              }}
            ></View>
          );
        }}
        renderItem={({ item }) => (
          <SearchListItem key={item.id} coordinator={coordinator} item={item} />
        )}
        ListHeaderComponent={
          <SearchHeaderItem
            filters={params}
            onChange={handleFilterUpdate}
            hits={searchResultHits}
          />
        }
      ></FlatList>
    </SafeAreaView>
  );
};
