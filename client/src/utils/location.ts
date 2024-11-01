import cities from '../assets/json/VNLocation/cities.json'
import districts from '../assets/json/VNLocation/districts.json'
import wards from '../assets/json/VNLocation/wards.json'

const findDistricts = (cityId: string) => {
  return districts.filter((district) => district.parent_code === cityId)
}

const findWards = (districtId: string) => {
  return wards.filter((ward) => ward.parent_code === districtId)
}

export { cities, districts, wards, findDistricts, findWards }
