import { Flex, Spin } from "antd"

export const Spinner = (): JSX.Element => {
  return (
    <Flex flex={1} justify="center" align="center">
      <Spin size="large" tip='Загрузка...' fullscreen/>
    </Flex>
  )
}