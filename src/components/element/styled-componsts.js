import styled from 'styled-components'

export const themeObj = {
  grey: {
    0: '#FFFFFF',
    100: '#F9FAFB',
    200: '#F4F6F8',
    300: '#DFE3E8',
    400: '#C4CDD5',
    500: '#919EAB',
    600: '#637381',
    700: '#454F5B',
    800: '#212B36',
    900: '#161C24',
  },
  font_size: {
    size1: '54px',
    size2: '32px',
    size3: '28px',
    size4: '24px',
    size5: '20px',
    size6: '18px',
    size7: '16px',
    size8: '14px',
    size9: '12px',
    size10: '10px',
    size11: '8px',
  }
}

export const Row = styled.div`
display: flex;
`
export const Col = styled.div`
display: flex;
flex-direction:column;
`
export const RowMobileColumn = styled.div`
display: flex;
@media (max-width:1000px) {
    flex-direction:column;
}
`
export const Title = styled.div`
font-size:${themeObj.font_size.size4};
font-weight:bold;
color: darkgoldenrod;
`
export const SideTitle = styled.div`
margin: 1rem auto 1rem 0;
font-size:${themeObj.font_size.size3};
font-weight:bold;
`
const ItemName = styled.div`
font-weight: bold;
font-size:${themeObj.font_size.size7};
word-break: break-all;
`
const ItemSubName = styled.div`
margin-top:0.25rem;
color:${themeObj.grey[500]};
font-size:${themeObj.font_size.size8};
word-break: break-all;
`
const ItemPrice = styled.div`
margin-top:0.5rem;
font-size:${themeObj.font_size.size7};
display:flex;
align-items:center;
flex-wrap:wrap;
`
const ItemContainer = styled.div`
width:100%;
display:flex;
flex-direction:column;
cursor:pointer;
transition: 0.5s;
position: relative;
&:hover{
  transform: translateY(-8px);
}
`
const ItemImg = styled.img`
height: 15rem;
width:auto;
margin:auto;
margin-top:3rem;
@media (max-width:1000px) {
  height: 10rem;
}
`
const ItemTextContainer = styled.div`
display:flex;
flex-direction: column;
margin-top:3rem;
`


const ItemsContainer = styled.div`
display:flex;
flex-wrap:wrap;
column-gap: 2%;
row-gap: 2rem;
width:100%;
@media (max-width: 650px) {
  column-gap: 2%;
}
`
const ItemWrapper = styled.div`
width:18.4%;
@media (max-width: 1150px) {
  width:32%;
}
@media (max-width: 850px) {
  width:49%;
}
@media (max-width: 650px) {
  width:49%;
}
`
export const Label = styled.div`
max-width: 330px;
width:100%;
display: flex;
@media (max-width: 1000px) {
}
`
export const Content = styled.div`
display: flex;
align-items: center;
row-gap: 0.2rem;
column-gap: 0.2rem;
@media (max-width:1000px) {
    flex-direction:column;
    align-items: flex-start;
}

`
export const EditContent = styled.div`

`