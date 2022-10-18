import { Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { useResources } from "../../resources";

import { observer } from "mobx-react";
import { styleStore, SessionStore } from "../../services/storage";
import { useFetchPaymentMethods } from "../../services/graphql";

const noOp = (data: any) => data;
export type SelectPaymentProps = {
  onSelect?: Function;
};

const styleObject = (colors: any, isSelected: boolean) =>
  StyleSheet.create({
    wrapper: isSelected
      ? {
          paddingVertical: 20,
          paddingHorizontal: 10,
          borderRadius: 13,
          borderWidth: 2,
          borderColor: colors.primary,
        }
      : {
          paddingVertical: 20,
          paddingHorizontal: 10,
          borderRadius: 13,
        },
  });

const SelectPayment = ({ onSelect = noOp }: SelectPaymentProps) => {
  const [{ globalStyles }] = React.useState(styleStore);

  const { colors } = useResources();

  const [{ accessToken }] = React.useState(() => SessionStore);

  const [selectedPayment, setSelectedPayment] = React.useState<null | any>(
    null
  );

  const {
    fetchPaymentMethods,
    paymentMethods,
    paymentMethodsLoading,
    paymentMethodsError,
  } = useFetchPaymentMethods();

  React.useEffect(() => {
    if (!accessToken) return;
    fetchPaymentMethods();
  }, [accessToken]);

  const selectPaymentMethod = React.useCallback(
    (method) => {
      setSelectedPayment(method);

      onSelect && onSelect(method);
    },
    [onSelect]
  );

  const disSelectPaymentMethod = React.useCallback(() => {
    setSelectedPayment(null);
    onSelect && onSelect(null);
  }, [onSelect]);

  if (!accessToken) return <Text>Please login to load payment source.</Text>;

  return (
    <>
      {paymentMethodsLoading && <Text>Payment methods loading ...</Text>}

      {!paymentMethodsLoading && paymentMethodsError && (
        <Text>Could not load payment methods</Text>
      )}

      {paymentMethods?.paymentSource?.map(
        (paymentSource: any, index: number) => {
          const isSelected = selectedPayment?.id === paymentSource?.id;
          return (
            <Pressable
              key={index}
              style={[
                styleObject(colors, isSelected).wrapper,
                globalStyles.row,
                { justifyContent: "space-between" },
              ]}
              onPress={() => {
                if (!isSelected) selectPaymentMethod(paymentSource);
                if (isSelected) disSelectPaymentMethod();
              }}
            >
              <Text>
                {paymentSource?.brand?.toUpperCase()}
                <Text>
                  {paymentSource.expMonth}/{paymentSource.expYear}
                </Text>{" "}
              </Text>

              <Text>... {paymentSource.last4}</Text>
            </Pressable>
          );
        }
      )}
    </>
  );
};

export default observer(SelectPayment);
