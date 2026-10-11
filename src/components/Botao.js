import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { estilosComuns } from '../theme';

export default function Botao({ titulo, onPress, carregando = false, style }) {
  return (
    <TouchableOpacity
      style={[estilosComuns.botao, carregando && estilosComuns.botaoDesabilitado, style]}
      onPress={onPress}
      disabled={carregando}
      activeOpacity={0.8}
    >
      {carregando ? <ActivityIndicator color="#FFF" /> : <Text style={estilosComuns.botaoTexto}>{titulo}</Text>}
    </TouchableOpacity>
  );
}
