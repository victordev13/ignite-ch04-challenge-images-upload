import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { AxiosResponse } from 'axios';
import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

interface ImageProps {
  url: string;
  title: string;
  description: string;
}

interface FormData {
  image: Record<string, unknown>;
  title: string;
  description: string;
}

const request = (data: ImageProps): Promise<AxiosResponse> => {
  return api.post('/api/images', data);
};

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: 'Arquivo obrigatório',
      validate: {
        lessThan10MB: file =>
          file[0]?.size < 10 * 1000 * 1000 ||
          'O arquivo deve ser menor que 10MB',
        acceptedFormats: file =>
          new RegExp(/\/(gif|jpg|jpeg|png)$/i).test(file[0]?.type) ||
          'Somente são aceitos arquivos PNG, JPEG e GIF',
      },
    },
    title: {
      required: 'Título obrigatório',
      minLength: {
        message: 'Mínimo de 2 caracteres',
        value: 2,
      },
      maxLength: {
        message: 'Máximo de 65 caracteres',
        value: 65,
      },
    },
    description: {
      required: 'Descrição obrigatória',
      maxLength: {
        message: 'Máximo de 65 caracteres',
        value: 65,
      },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(request, {
    onSuccess: () => {
      queryClient.invalidateQueries('images');
    },
  });

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          status: 'error',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
        });

        return;
      }

      const { title, description } = data;

      await mutation.mutateAsync({ url: imageUrl, title, description });
      toast({
        title: 'Imagem cadastrada!',
        status: 'success',
        description: 'Sua imagem foi cadastrada com sucesso.',
      });
    } catch {
      toast({
        title: 'Falha no cadastro',
        status: 'error',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
      });
    } finally {
      reset();
      setImageUrl('');
      setLocalImageUrl('');
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          {...register('image', formValidations.image)}
          error={errors.image}
        />

        <TextInput
          placeholder="Título da imagem..."
          {...register('title', formValidations.title)}
          error={errors.title}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          {...register('description', formValidations.description)}
          error={errors.description}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
