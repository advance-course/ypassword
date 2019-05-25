import Taro, { useState } from '@tarojs/taro';
import { View, Button, Text } from '@tarojs/components';

export default function Profile() {
  const [counter, setCounter] = useState(0);

  function indecAsync() {
    setTimeout(() => {
      setCounter(counter + 1);
    }, 1000);
  }
  return (
    <View>
      <Button onClick={() => setCounter(counter + 1)}>+</Button>
      <Button onClick={() => setCounter(counter - 1)}>-</Button>
      <Button onClick={indecAsync}>Async Add</Button>
      <Text>{counter}</Text>
    </View>
  )
}