import axios from 'axios'

const propertyDealsApi = axios.create({
  baseURL: process.env.PROPERTY_DEALS_API_URL,
  headers: {
    'Authorization': `Bearer ${process.env.PROPERTY_DEALS_API_KEY}`,
    'Content-Type': 'application/json'
  }
})

export const getPropertyValuation = async (
  address: string,
  squareMeters: number,
  logo?: File
) => {
  const formData = new FormData()
  formData.append('address', address)
  formData.append('squareMeters', squareMeters.toString())
  if (logo) {
    formData.append('logo', logo)
  }

  const response = await propertyDealsApi.post('/valuation', formData)
  return response.data
}
