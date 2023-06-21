export const SUBSCRIPTION_OBJECT = `
id
amount
currentPeriodEnd
currentPeriodStart
name
remainingUnit
type
priceType
unit
isCanceled
endsAt
`;

export const ALL_SUBSCRIPTION_OBJECT = `
   id
   name
   title
   type
   unit
   prices{
        id
        amount
        currency
        name
        priceRange
   }
`;
