import { Button, ButtonProps } from '@chakra-ui/react';

type Props = ButtonProps & {
  isLoading?: boolean;
};

export function LoadMoreButton({
  isLoading = false,
  ...rest
}: Props): JSX.Element {
  return (
    <Button {...rest} disabled={!!isLoading}>
      {isLoading ? 'Carregando...' : 'Carregar mais'}
    </Button>
  );
}
