// components/GroceryListCard.tsx
import { Text, TouchableOpacity, View } from 'react-native';
import { GroceryList } from '../types/GroceryList';

interface Props {
    list: GroceryList;
    onPress: (id: string) => void;
}

const colorMap = {
    blue: 'bg-blue-100 border-l-blue-500',
    green: 'bg-green-100 border-l-green-500',
    red: 'bg-red-100 border-l-red-500',
    yellow: 'bg-yellow-100 border-l-yellow-500',
    purple: 'bg-purple-100 border-l-purple-500',
};

export function GroceryListCard({ list, onPress }: Props) {
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: '2-digit',
        });
    };


    const bgClasses = list.isPinned
        ? 'bg-blue-100 border-l-blue-500'
        : 'bg-gray-100 border-l-gray-400';

    const textClasses = list.isPinned
        ? 'text-blue-800'
        : 'text-black/90';

    return (
        <TouchableOpacity
            onPress={() => onPress(list.id)}
            className={`p-4 rounded-lg border-l-4 mb-3 ${bgClasses}`}
        >
            <View className="flex-row items-start justify-between">
                <View className="flex-1">
                    <Text className={`text-lg font-dm-medium ${textClasses} mb-1`}>
                        {list.title}
                    </Text>
                    <View className="flex-row items-center gap-2">
                        <Text className="text-sm text-black/70 font-dm">
                            {formatDate(list.createdAt)}
                        </Text>
                        <Text className="text-sm text-black/70 font-dm">By {list.owner}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}