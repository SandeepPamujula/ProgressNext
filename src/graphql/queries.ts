import { gql } from '@apollo/client';

export const GET_HOUSES = gql`
  query GetHouses {
    houses {
      id
      title
      description
      price
      address {
        street
        city
        state
        zipCode
      }
      bedrooms
      bathrooms
      squareFeet
      available
      images {
        exterior
        interior
      }
      amenities
    }
  }
`;

export const GET_HOUSES_BY_STATE = gql`
  query GetHousesByState($state: String!) {
    housesByState(state: $state) {
      id
      title
      description
      price
      address {
        street
        city
        state
        zipCode
      }
      bedrooms
      bathrooms
      squareFeet
      available
      images {
        exterior
        interior
      }
      amenities
    }
  }
`;

export const GET_HOUSES_BY_ZIP_CODE = gql`
  query GetHousesByZipCode($zipCode: String!) {
    housesByZipCode(zipCode: $zipCode) {
      id
      title
      description
      price
      address {
        street
        city
        state
        zipCode
      }
      bedrooms
      bathrooms
      squareFeet
      available
      images {
        exterior
        interior
      }
      amenities
    }
  }
`;

export const GET_HOUSE = gql`
  query GetHouse($id: ID!) {
    house(id: $id) {
      id
      title
      description
      price
      address {
        street
        city
        state
        zipCode
      }
      bedrooms
      bathrooms
      squareFeet
      available
      images {
        exterior
        interior
      }
      amenities
    }
  }
`;

export const SUBMIT_LEASE_APPLICATION = gql`
  mutation SubmitLeaseApplication($application: LeaseApplicationInput!) {
    submitLeaseApplication(application: $application) {
      id
      status
      paymentStatus
      applicationFee
    }
  }
`;

export const PROCESS_APPLICATION_PAYMENT = gql`
  mutation ProcessApplicationPayment($payment: PaymentInput!) {
    processApplicationPayment(payment: $payment) {
      success
      message
      transactionId
    }
  }
`;
