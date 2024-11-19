import cities from '../assets/json/VNLocation/cities.json'
import districts from '../assets/json/VNLocation/districts.json'
import wards from '../assets/json/VNLocation/wards.json'

const findDistricts = (cityId: string) => {
  return districts.filter((district) => district.parent_code === cityId)
}

const findWards = (districtId: string) => {
  return wards.filter((ward) => ward.parent_code === districtId)
}

const getLocation = (
  provinceCode: string,
  districtCode: string,
  wardCode: string
) => {
  const province = cities.find((city) => city.code === provinceCode)
  const district = districts.find((district) => district.code === districtCode)
  const ward = wards.find((ward) => ward.code === wardCode)
  return `${ward?.name}, ${district?.name}, ${province?.name}`
}

export { cities, districts, wards, findDistricts, findWards, getLocation }
